import { dev } from '$app/environment';
import { renderMarkdown } from '$lib/blog/markdown';
import { parseFrontmatter } from '$lib/blog/frontmatter';
import { tagSlug } from '$lib/blog/format';
import type { Post, PostMeta, Tag, TagSummary } from '$lib/blog/types';

// Every markdown file in src/posts is a post. The filename is the permalink.
const files = import.meta.glob('/src/posts/*.md', { as: 'raw', eager: true });

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

function fail(file: string, message: string): never {
	throw new Error(`[blog] ${file}: ${message}`);
}

function plainText(markdown: string): string {
	return markdown
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
		.replace(/^#+\s.*$/gm, ' ')
		.replace(/[*_`>#~]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

function excerpt(markdown: string, max = 180): string {
	const firstParagraph = markdown
		.split(/\n\s*\n/)
		.map(plainText)
		.find(Boolean);
	if (!firstParagraph) return '';
	if (firstParagraph.length <= max) return firstParagraph;
	return firstParagraph.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

function load(path: string, source: string): Post {
	const file = path.split('/').pop() as string;
	const slug = file.replace(/\.md$/, '');
	if (!SLUG.test(slug)) {
		fail(file, 'filename must be lowercase-with-hyphens, e.g. why-i-killed-this-idea.md');
	}

	const { data, body } = parseFrontmatter(source);

	const title = data.title;
	if (typeof title !== 'string' || !title) fail(file, 'missing `title`');

	const date = data.date;
	if (typeof date !== 'string' || !DAY.test(date)) fail(file, '`date` must be YYYY-MM-DD');

	const updated = data.updated;
	if (updated !== undefined && (typeof updated !== 'string' || !DAY.test(updated))) {
		fail(file, '`updated` must be YYYY-MM-DD');
	}

	const rawTags = data.tags ?? [];
	const tags: Tag[] = (Array.isArray(rawTags) ? rawTags : [String(rawTags)]).map((name) => ({
		name,
		slug: tagSlug(name)
	}));

	const words = plainText(body).split(' ').filter(Boolean).length;

	return {
		slug,
		title,
		date,
		updated: updated as string | undefined,
		summary: typeof data.summary === 'string' ? data.summary : excerpt(body),
		tags,
		draft: data.draft === true,
		readingMinutes: Math.max(1, Math.round(words / 220)),
		html: renderMarkdown(body)
	};
}

const allPosts: Post[] = Object.entries(files)
	.map(([path, source]) => load(path, source))
	.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

/** Published posts, newest first. Drafts are visible in `npm run dev` only. */
export function getPosts(): Post[] {
	return allPosts.filter((post) => dev || !post.draft);
}

export function getPost(slug: string): Post | undefined {
	return getPosts().find((post) => post.slug === slug);
}

export function getTags(): TagSummary[] {
	const bySlug = new Map<string, TagSummary>();
	for (const post of getPosts()) {
		for (const tag of post.tags) {
			const existing = bySlug.get(tag.slug);
			if (existing) existing.count += 1;
			else bySlug.set(tag.slug, { ...tag, count: 1 });
		}
	}
	return [...bySlug.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Strip the rendered body for list views, which only need metadata. */
export function toMeta(post: Post): PostMeta {
	const meta: PostMeta & { html?: string } = { ...post };
	delete meta.html;
	return meta;
}
