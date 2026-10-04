// Imports a Notion page as a blog post.
//
//   npm run notion -- <notion page url> [--title "Post title"] [--slug my-post]
//
// Writes src/posts/<slug>.md and downloads its images to static/images/<slug>/. The page's
// cover photo becomes the post's banner. Running it again on the same page updates the body and
// banner in place. See README → "From Notion".

import { execFileSync } from 'node:child_process';
import { existsSync, unlinkSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { parseFrontmatter } from '../src/lib/blog/frontmatter.ts';
import {
	blocksToMarkdown,
	type Block,
	type BlockContent,
	type RichText
} from './notion/to-markdown.ts';

const POSTS_DIR = 'src/posts';
const IMAGES_DIR = 'static/images';
const MAX_EDGE = 1600;
const BANNER_EDGE = 2400;
const NOTION_VERSION = '2022-06-28';

const warnings = new Set<string>();
const warn = (message: string) => warnings.add(message);

function die(message: string): never {
	console.error(`\n✗ ${message}\n`);
	process.exit(1);
}

// ---------- Notion API ----------

async function notion<T>(path: string): Promise<T> {
	const token = process.env.NOTION_TOKEN;
	for (let attempt = 0; ; attempt++) {
		const res = await fetch(`https://api.notion.com/v1/${path}`, {
			headers: { Authorization: `Bearer ${token}`, 'Notion-Version': NOTION_VERSION }
		});
		if (res.status === 429 && attempt < 5) {
			const wait = Number(res.headers.get('retry-after') ?? 1) * 1000;
			await new Promise((resolve) => setTimeout(resolve, wait));
			continue;
		}
		if (res.status === 404 || res.status === 403) {
			die(
				'Notion says it can’t find that page. Open it in Notion, click ••• → Connections, ' +
					'and add your integration (or add it to a parent page).'
			);
		}
		if (res.status === 401)
			die('NOTION_TOKEN was rejected. Copy it again from notion.so/my-integrations.');
		if (!res.ok) die(`Notion API ${res.status}: ${await res.text()}`);
		return (await res.json()) as T;
	}
}

async function fetchChildren(id: string): Promise<Block[]> {
	const blocks: Block[] = [];
	let cursor: string | undefined;
	do {
		const query = `page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`;
		const page = await notion<{ results: Block[]; next_cursor: string | null }>(
			`blocks/${id}/children?${query}`
		);
		blocks.push(...page.results);
		cursor = page.next_cursor ?? undefined;
	} while (cursor);

	for (const block of blocks) {
		if (block.has_children && block.type !== 'child_page' && block.type !== 'child_database') {
			block.children = await fetchChildren(block.id);
		}
	}
	return blocks;
}

interface Property {
	type: string;
	title?: RichText[];
	rich_text?: RichText[];
	multi_select?: { name: string }[];
	select?: { name: string } | null;
	date?: { start: string } | null;
}

interface NotionFile {
	type: string;
	file?: { url: string };
	external?: { url: string };
}

interface Page {
	id: string;
	cover: NotionFile | null;
	properties: Record<string, Property>;
}

function pageId(input: string): string {
	const hex = input
		.split(/[?#]/)[0]
		.replace(/-/g, '')
		.match(/[0-9a-f]{32}(?=[^0-9a-f]*$)/i);
	if (!hex) die(`Couldn’t find a page id in "${input}". Paste the page’s link from Notion.`);
	return hex[0].toLowerCase();
}

/** Reads optional database columns: Tags or Topic, Summary, Date, Slug (any capitalization). */
function readProperties(page: Page) {
	const text = (p?: Property) =>
		(p?.title ?? p?.rich_text ?? [])
			.map((t) => t.plain_text)
			.join('')
			.trim();
	const find = (pattern: RegExp) =>
		Object.entries(page.properties).find(([name]) => pattern.test(name))?.[1];

	const titleProp = Object.values(page.properties).find((p) => p.type === 'title');
	const tagsProp = find(/^(tags?|topics?)$/i);
	const tags =
		tagsProp?.multi_select?.map((t) => t.name) ??
		(tagsProp?.select ? [tagsProp.select.name] : undefined);

	return {
		title: text(titleProp),
		tags: tags?.length ? tags : undefined,
		summary: text(find(/^(summary|description|excerpt)$/i)) || undefined,
		date: find(/^(date|published|publish date)$/i)?.date?.start?.slice(0, 10),
		slug: text(find(/^slug$/i)) || undefined
	};
}

// ---------- images and files ----------

const MEDIA = new Set(['image', 'video', 'audio', 'file', 'pdf']);
const CONTENT_TYPES: Record<string, string> = {
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/gif': '.gif',
	'image/webp': '.webp',
	'image/heic': '.heic',
	'image/svg+xml': '.svg',
	'video/mp4': '.mp4',
	'audio/mpeg': '.mp3',
	'application/pdf': '.pdf'
};

function* walk(blocks: Block[]): Generator<Block> {
	for (const block of blocks) {
		yield block;
		if (block.children) yield* walk(block.children);
	}
}

function sips(...args: string[]): string {
	return execFileSync('sips', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}

/** Shrinks big photos the way the README suggests, and turns iPhone HEIC into JPEG. */
function optimize(file: string, ext: string, maxEdge = MAX_EDGE): string {
	if (process.platform !== 'darwin') {
		warn('Images weren’t resized (that uses macOS `sips`). Check their sizes before publishing.');
		return file;
	}
	if (ext === '.heic') {
		const jpg = file.replace(/\.heic$/, '.jpg');
		sips('-s', 'format', 'jpeg', file, '--out', jpg);
		unlinkSync(file);
		file = jpg;
		ext = '.jpg';
	}
	if (['.jpg', '.jpeg', '.png'].includes(ext)) {
		const info = sips('-g', 'pixelWidth', '-g', 'pixelHeight', file);
		const sizes = [...info.matchAll(/pixel(?:Width|Height): (\d+)/g)].map((m) => Number(m[1]));
		if (Math.max(...sizes) > maxEdge) sips('-Z', String(maxEdge), file);
	}
	return file;
}

/**
 * Notion's file links expire after an hour, so every uploaded image and file is copied into
 * static/images/<slug>/. Files are named after their block, so re-imports skip ones already there.
 */
async function downloadAssets(blocks: Block[], slug: string): Promise<Map<string, string>> {
	const dir = join(IMAGES_DIR, slug);
	const assets = new Map<string, string>();
	const keep = new Set<string>();

	for (const block of walk(blocks)) {
		if (!MEDIA.has(block.type)) continue;
		const c = block[block.type] as BlockContent;
		const url = c.type === 'external' ? c.external?.url : c.file?.url;
		// Keep links to videos and files hosted elsewhere; only copy uploads and images.
		if (!url || (c.type === 'external' && block.type !== 'image')) continue;

		const id = block.id.replace(/-/g, '').slice(0, 8);
		let ext = extname(new URL(url).pathname).toLowerCase().replace('.jpeg', '.jpg');
		const finalExt = ext === '.heic' ? '.jpg' : ext;
		const existing = ext && join(dir, id + finalExt);

		let file: string;
		if (existing && existsSync(existing)) {
			file = existing;
		} else {
			const res = await fetch(url);
			if (!res.ok) {
				warn(`Couldn’t download a ${block.type} (${res.status}): ${url}`);
				continue;
			}
			ext ||= CONTENT_TYPES[res.headers.get('content-type')?.split(';')[0] ?? ''] ?? '.bin';
			await mkdir(dir, { recursive: true });
			file = join(dir, id + ext);
			await writeFile(file, Buffer.from(await res.arrayBuffer()));
			file = optimize(file, ext);
			console.log(`  ↓ ${file}`);
		}

		const { size } = await stat(file);
		if (size > 10 * 1024 * 1024) {
			warn(`${file} is ${(size / 1024 / 1024).toFixed(0)} MB. Consider hosting it elsewhere.`);
		}
		keep.add(file.split('/').pop() as string);
		assets.set(block.id, '/' + file.replace(/^static\//, ''));
	}

	// Remove files from images that were deleted in Notion since the last import.
	if (existsSync(dir)) {
		for (const name of await readdir(dir)) {
			if (/^[0-9a-f]{8}\.\w+$/.test(name) && !keep.has(name)) {
				await rm(join(dir, name));
				console.log(`  ✗ removed ${join(dir, name)}`);
			}
		}
	}
	return assets;
}

/** The page's cover photo becomes the post banner, saved as static/images/<slug>/cover.jpg. */
async function downloadCover(page: Page, slug: string): Promise<string | undefined> {
	const url = page.cover?.type === 'external' ? page.cover.external?.url : page.cover?.file?.url;
	if (!url) return undefined;

	const res = await fetch(url);
	if (!res.ok) {
		warn(`Couldn’t download the cover photo (${res.status}), so the post has no banner.`);
		return undefined;
	}
	const type = res.headers.get('content-type')?.split(';')[0] ?? '';
	const ext = CONTENT_TYPES[type] ?? (extname(new URL(url).pathname).toLowerCase() || '.jpg');

	const dir = join(IMAGES_DIR, slug);
	await mkdir(dir, { recursive: true });
	for (const name of await readdir(dir)) {
		if (name.startsWith('cover.')) await rm(join(dir, name));
	}
	const download = join(dir, `cover${ext}`);
	await writeFile(download, Buffer.from(await res.arrayBuffer()));
	const file = optimize(download, ext, BANNER_EDGE);
	console.log(`  ↓ ${file} (banner)`);
	return '/' + file.replace(/^static\//, '');
}

// ---------- the post file ----------

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugify(title: string): string {
	return title
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/['’]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80)
		.replace(/-+$/, '');
}

function today(): string {
	const d = new Date();
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function quote(value: string): string {
	return `"${value.replace(/\s+/g, ' ')}"`;
}

function tagList(tags: string[]): string {
	return `[${tags.map((t) => (/[,"'\]]/.test(t) ? quote(t.replace(/[,"]/g, '')) : t)).join(', ')}]`;
}

/** Replaces one frontmatter field (including a `- item` list under it), or adds it at the end. */
function setField(front: string, key: string, value: string): string {
	const line = `${key}: ${value}`;
	const pattern = new RegExp(`^${key}:.*(?:\\n[ \\t]+-.*)*$`, 'm');
	return pattern.test(front) ? front.replace(pattern, line) : `${front}\n${line}`;
}

async function findPostForPage(id: string): Promise<string | undefined> {
	for (const name of await readdir(POSTS_DIR)) {
		if (!name.endsWith('.md')) continue;
		const { data } = parseFrontmatter(await readFile(join(POSTS_DIR, name), 'utf8'));
		if (typeof data.notion === 'string' && data.notion.replace(/-/g, '') === id) {
			return name.replace(/\.md$/, '');
		}
	}
	return undefined;
}

// ---------- main ----------

function takeFlag(args: string[], name: string): string | undefined {
	const at = args.indexOf(name);
	return at >= 0 ? args.splice(at, 2)[1] : undefined;
}

async function main() {
	const args = process.argv.slice(2);
	const slugArg = takeFlag(args, '--slug');
	const titleArg = takeFlag(args, '--title');
	const input = args[0];

	if (!input)
		die('Usage: npm run notion -- <notion page url> [--title "Post title"] [--slug my-post]');
	if (!process.env.NOTION_TOKEN) {
		die(
			'NOTION_TOKEN isn’t set. Create an integration at notion.so/my-integrations, then add\n' +
				'  NOTION_TOKEN=ntn_...\nto a .env file in the project root. See README → "From Notion".'
		);
	}

	const id = pageId(input);
	console.log('Reading the page from Notion…');
	const page = await notion<Page>(`pages/${id}`);
	const props = readProperties(page);
	const title = titleArg ?? props.title;
	if (!title) die('The Notion page has no title. Give it one, or pass --title.');

	const existingSlug = await findPostForPage(id);
	const slug = existingSlug ?? slugArg ?? props.slug ?? slugify(title);
	if (!SLUG.test(slug)) die(`"${slug}" isn’t a valid slug. Use lowercase-with-hyphens.`);
	if (existingSlug && slugArg && slugArg !== existingSlug) {
		warn(`Kept the existing slug "${existingSlug}"; permalinks don’t change once posted.`);
	}

	const path = join(POSTS_DIR, `${slug}.md`);
	if (!existingSlug && existsSync(path)) {
		die(`${path} already exists and came from somewhere else. Pass --slug to pick another name.`);
	}

	const source = existingSlug ? await readFile(path, 'utf8') : '';
	const old = parseFrontmatter(source);

	// A banner picked by hand (any `image:` other than the cover this script saved) wins over
	// the Notion cover.
	const ownBanner = typeof old.data.image === 'string' && !/\/cover\.\w+$/.test(old.data.image);
	const blocks = await fetchChildren(id);
	const assets = await downloadAssets(blocks, slug);
	const banner = ownBanner ? undefined : await downloadCover(page, slug);
	const body = blocksToMarkdown(blocks, { assets, warn });

	let front: string;
	if (existingSlug) {
		// After the first import the frontmatter is yours to edit. Only the banner and the
		// "revised" date are kept in step with Notion.
		front = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';

		if (titleArg) front = setField(front, 'title', quote(titleArg));
		if (banner) front = setField(front, 'image', banner);

		// Edits to a published post get a "revised" note, per the README.
		const published = old.data.draft !== true;
		if (published && old.body.trim() !== body.trim() && old.data.date !== today()) {
			front = setField(front, 'updated', today());
		}
	} else {
		front = [
			`title: ${quote(title)}`,
			`date: ${props.date ?? today()}`,
			props.tags && `tags: ${tagList(props.tags)}`,
			props.summary && `summary: ${quote(props.summary)}`,
			banner && `image: ${banner}`,
			'draft: true',
			`notion: ${id}`
		]
			.filter(Boolean)
			.join('\n');
	}

	await writeFile(path, `---\n${front}\n---\n\n${body}`);

	console.log(`\n✓ ${existingSlug ? 'Updated' : 'Created'} ${path}`);
	for (const message of warnings) console.log(`  ! ${message}`);
	if (!existingSlug) {
		console.log(
			`\nIt’s a draft. Preview it with \`npm run dev\` at http://localhost:5173/blog/${slug},` +
				'\nthen delete the `draft: true` line to publish.'
		);
	}
}

main().catch((error) => die(error instanceof Error ? error.message : String(error)));
