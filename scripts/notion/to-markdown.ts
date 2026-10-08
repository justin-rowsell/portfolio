// Turns Notion API blocks into markdown for src/posts.
//
// Plain markdown covers most of Notion. The rest is written as small HTML snippets that
// marked passes through and the post page styles:
//   callout           <aside class="callout">
//   toggle            <details><summary>
//   columns           <div class="columns"><div class="column">
//   text colors       <span class="notion-red">, <mark class="notion-red_background">
//   underline         <u>
//   video embeds      <div class="embed"><iframe>
// Markdown inside those snippets still renders, because each is split onto its own lines
// with blank lines around the markdown.

export interface RichText {
	type: 'text' | 'mention' | 'equation';
	plain_text: string;
	href: string | null;
	annotations: {
		bold: boolean;
		italic: boolean;
		strikethrough: boolean;
		underline: boolean;
		code: boolean;
		color: string;
	};
}

export interface BlockContent {
	rich_text?: RichText[];
	caption?: RichText[];
	color?: string;
	checked?: boolean;
	language?: string;
	is_toggleable?: boolean;
	icon?: { type: string; emoji?: string } | null;
	type?: string;
	file?: { url: string };
	external?: { url: string };
	name?: string;
	url?: string;
	expression?: string;
	has_column_header?: boolean;
	cells?: RichText[][];
}

export interface Block {
	id: string;
	type: string;
	has_children: boolean;
	/** Filled in by the fetcher; the API returns children separately. */
	children?: Block[];
	[content: string]: unknown;
}

export interface ConvertOptions {
	/** Site URL of each downloaded image or file, by block id. */
	assets?: Map<string, string>;
	warn?: (message: string) => void;
}

interface Context {
	assets: Map<string, string>;
	warn: (message: string) => void;
}

export function blocksToMarkdown(blocks: Block[], options: ConvertOptions = {}): string {
	const ctx: Context = {
		assets: options.assets ?? new Map(),
		warn: options.warn ?? (() => undefined)
	};
	return renderBlocks(blocks, ctx).trim() + '\n';
}

// ---------- blocks ----------

const LIST_TYPES = new Set(['bulleted_list_item', 'numbered_list_item', 'to_do']);

function content(block: Block): BlockContent {
	return (block[block.type] ?? {}) as BlockContent;
}

function renderBlocks(blocks: Block[], ctx: Context): string {
	let out = '';
	let previous = '';
	for (const block of blocks) {
		const md = renderBlock(block, ctx);
		if (md === null) continue;
		// Consecutive items of the same list stay tight; everything else is a new paragraph.
		const tight = LIST_TYPES.has(block.type) && block.type === previous;
		if (out) out += tight ? '\n' : '\n\n';
		out += md;
		previous = block.type;
	}
	return out;
}

function renderChildren(block: Block, ctx: Context): string {
	return block.children?.length ? renderBlocks(block.children, ctx) : '';
}

function indent(text: string, width: number): string {
	const pad = ' '.repeat(width);
	return text
		.split('\n')
		.map((line) => (line ? pad + line : line))
		.join('\n');
}

/** Wraps markdown in an HTML element, keeping the markdown inside it rendered. */
function wrapBlock(open: string, close: string, inner: string): string {
	return inner ? `${open}\n\n${inner}\n\n${close}` : `${open}\n${close}`;
}

function joinParts(...parts: string[]): string {
	return parts.filter(Boolean).join('\n\n');
}

function renderBlock(block: Block, ctx: Context): string | null {
	const c = content(block);
	const text = () => colored(lineStart(richText(c.rich_text, ctx)), c.color);
	const children = () => renderChildren(block, ctx);

	switch (block.type) {
		case 'paragraph': {
			const body = joinParts(text(), children());
			return body || null;
		}

		case 'heading_1':
		case 'heading_2':
		case 'heading_3': {
			// The post title is the page's h1, so Notion's H1 becomes ##.
			const level = Number(block.type.slice(-1)) + 1;
			const heading = `${'#'.repeat(level)} ${colored(richText(c.rich_text, ctx), c.color)}`;
			return c.is_toggleable ? toggle(heading, children()) : heading;
		}

		case 'bulleted_list_item':
			return listItem('- ', block, text(), children());
		case 'numbered_list_item':
			return listItem('1. ', block, text(), children());
		case 'to_do':
			return listItem(`- [${c.checked ? 'x' : ' '}] `, block, text(), children());

		case 'toggle':
			return toggle(text(), children());

		case 'quote':
			return joinParts(text(), children())
				.split('\n')
				.map((line) => (line ? `> ${line}` : '>'))
				.join('\n');

		case 'callout': {
			// Notion's default callout color is gray_background; the site's sand matches it.
			const color = c.color && c.color !== 'default' && c.color !== 'gray_background';
			const classes = color ? `callout notion-${c.color}` : 'callout';
			const icon =
				c.icon?.type === 'emoji' && c.icon.emoji
					? `\n<span class="callout-icon" aria-hidden="true">${c.icon.emoji}</span>`
					: '';
			const body = joinParts(lineStart(richText(c.rich_text, ctx)), children());
			return wrapBlock(
				`<aside class="${classes}">${icon}\n<div class="callout-body">`,
				'</div>\n</aside>',
				body
			);
		}

		case 'code': {
			const code = (c.rich_text ?? []).map((t) => t.plain_text).join('');
			const longest = Math.max(2, ...(code.match(/`+/g) ?? []).map((run) => run.length));
			const fence = '`'.repeat(longest + 1);
			return `${fence}${codeLanguage(c.language)}\n${code}\n${fence}`;
		}

		case 'equation':
			ctx.warn('Equations are shown as code; the site has no math renderer.');
			return '```tex\n' + (c.expression ?? '') + '\n```';

		case 'divider':
			return '---';

		case 'image': {
			const src = ctx.assets.get(block.id) ?? sourceUrl(c);
			if (!src) return null;
			const caption = plain(c.caption);
			const title = caption ? ` "${caption.replace(/["\\]/g, '\\$&')}"` : '';
			return `![${escapeText(caption)}](${linkUrl(src)}${title})`;
		}

		case 'video': {
			const src = ctx.assets.get(block.id) ?? sourceUrl(c);
			if (!src) return null;
			const embed = embedUrl(src);
			if (embed) return iframe(embed);
			if (ctx.assets.has(block.id)) {
				return `<figure>\n<video controls preload="metadata" src="${attr(
					src
				)}"></video>\n</figure>`;
			}
			return link(plain(c.caption) || src, src);
		}

		case 'audio': {
			const src = ctx.assets.get(block.id) ?? sourceUrl(c);
			if (!src) return null;
			return `<figure>\n<audio controls preload="metadata" src="${attr(src)}"></audio>\n</figure>`;
		}

		case 'file':
		case 'pdf': {
			const src = ctx.assets.get(block.id) ?? sourceUrl(c);
			if (!src) return null;
			const name = plain(c.caption) || c.name || decodeURIComponent(src.split('/').pop() ?? src);
			return link(name, src);
		}

		case 'embed':
		case 'bookmark':
		case 'link_preview': {
			if (!c.url) return null;
			const embed = embedUrl(c.url);
			if (embed) return iframe(embed);
			return link(plain(c.caption) || c.url, c.url);
		}

		case 'table':
			return table(block, c, ctx);

		case 'column_list':
			return wrapBlock('<div class="columns">', '</div>', renderChildren(block, ctx));
		case 'column':
			return wrapBlock('<div class="column">', '</div>', renderChildren(block, ctx));

		case 'synced_block':
			return children() || null;

		case 'table_of_contents':
		case 'breadcrumb':
			return null;

		case 'child_page':
		case 'child_database':
		case 'link_to_page':
			ctx.warn(`Skipped a ${block.type.replace(/_/g, ' ')}; sub-pages aren't imported.`);
			return null;

		default:
			ctx.warn(`Skipped an unsupported "${block.type}" block.`);
			return null;
	}
}

function listItem(marker: string, block: Block, text: string, children: string): string {
	const first = marker + text;
	if (!children) return first;
	// A sub-list stays tight; anything else nested under an item needs a blank line.
	const subList = block.children?.every((child) => LIST_TYPES.has(child.type));
	return `${first}\n${subList ? '' : '\n'}${indent(children, marker.length)}`;
}

function toggle(summary: string, body: string): string {
	return `<details>\n<summary>\n\n${summary}\n\n</summary>${
		body ? `\n\n${body}` : ''
	}\n\n</details>`;
}

function table(block: Block, c: BlockContent, ctx: Context): string {
	const rows = (block.children ?? []).map((row) =>
		(content(row).cells ?? []).map((cell) => richText(cell, ctx).replace(/\|/g, '\\|') || ' ')
	);
	if (!rows.length) return '';
	const width = Math.max(...rows.map((row) => row.length));
	const line = (cells: string[]) =>
		`| ${Array.from({ length: width }, (_, i) => cells[i] ?? ' ').join(' | ')} |`;

	// GFM tables need a header row. Without one in Notion, write an empty header (hidden by CSS).
	const header = c.has_column_header ? rows.shift() ?? [] : [];
	return [line(header), line(Array(width).fill('---')), ...rows.map(line)].join('\n');
}

const LANGUAGES: Record<string, string> = {
	'plain text': '',
	'c++': 'cpp',
	'c#': 'csharp',
	'f#': 'fsharp',
	'objective-c': 'objectivec',
	'vb.net': 'vbnet',
	'visual basic': 'vb',
	'java/c/c++/c#': 'java'
};

function codeLanguage(language = ''): string {
	const key = language.toLowerCase();
	return key in LANGUAGES ? LANGUAGES[key] : key.replace(/\s+/g, '-');
}

function sourceUrl(c: BlockContent): string | undefined {
	return c.type === 'external' ? c.external?.url : c.file?.url;
}

function embedUrl(url: string): string | null {
	const youtube = url.match(
		/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
	);
	if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
	const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
	if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
	const loom = url.match(/loom\.com\/(?:share|embed)\/([\da-f]+)/);
	if (loom) return `https://www.loom.com/embed/${loom[1]}`;
	return null;
}

function iframe(src: string): string {
	return (
		`<div class="embed">\n<iframe src="${attr(src)}" loading="lazy" allowfullscreen ` +
		`allow="encrypted-media; picture-in-picture" title="Embedded video"></iframe>\n</div>`
	);
}

// ---------- inline text ----------

const WORDLIKE = /[\p{L}\p{N}*~_]/u;
const NOTION_LINK = /^\/|^https?:\/\/([\w-]+\.)*(notion\.so|notion\.site|notion\.com)\//;

function plain(items: RichText[] = []): string {
	return items
		.map((t) => t.plain_text)
		.join('')
		.replace(/\s+/g, ' ')
		.trim();
}

function attr(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/** Escapes the characters that would otherwise turn plain text into markdown. */
function escapeText(text: string): string {
	return text
		.replace(/[\\`*[\]<~]/g, '\\$&')
		.replace(/_/g, (match, i: number, s: string) =>
			// snake_case can't start emphasis, so leave it readable
			/[\p{L}\p{N}]/u.test(s[i - 1] ?? '') && /[\p{L}\p{N}]/u.test(s[i + 1] ?? '') ? match : '\\_'
		)
		.replace(/&(?=#?\w+;)/g, '&amp;')
		.replace(/\n/g, '<br>');
}

/** Stops text at the start of a block from reading as a heading, list, or quote. */
function lineStart(text: string): string {
	return text
		.replace(/^(#{1,6}(?=\s|$)|>|[+-](?=\s|$)|-(?=-+\s*$))/, '\\$1')
		.replace(/^(\d+)([.)])(?=\s|$)/, '$1\\$2');
}

function codeSpan(text: string): string {
	const code = text.replace(/\n/g, ' ');
	const longest = Math.max(0, ...(code.match(/`+/g) ?? []).map((run) => run.length));
	const ticks = '`'.repeat(longest + 1);
	const pad = code.startsWith('`') || code.endsWith('`') ? ' ' : '';
	return `${ticks}${pad}${code}${pad}${ticks}`;
}

function link(text: string, url: string): string {
	return `[${escapeText(text)}](${linkUrl(url)})`;
}

function linkUrl(url: string): string {
	return /[\s()<>]/.test(url) ? `<${url.replace(/[<>]/g, encodeURIComponent)}>` : url;
}

function colored(text: string, color?: string): string {
	if (!text || !color || color === 'default') return text;
	return color.endsWith('_background')
		? `<mark class="notion-${color}">${text}</mark>`
		: `<span class="notion-${color}">${text}</span>`;
}

function sameStyle(a: RichText, b: RichText): boolean {
	return (
		a.type === b.type &&
		a.type !== 'equation' &&
		a.href === b.href &&
		JSON.stringify(a.annotations) === JSON.stringify(b.annotations)
	);
}

function richText(items: RichText[] = [], ctx: Context): string {
	// Notion often splits one run of text into several identical segments; merge them first.
	const segments: RichText[] = [];
	for (const item of items) {
		const last = segments[segments.length - 1];
		if (last && sameStyle(last, item)) {
			segments[segments.length - 1] = { ...last, plain_text: last.plain_text + item.plain_text };
		} else {
			segments.push(item);
		}
	}

	let out = '';
	segments.forEach((segment, i) => {
		out += renderSegment(segment, out.slice(-1), segments[i + 1], ctx);
	});
	return out;
}

function isEmphasized(t: RichText | undefined): boolean {
	return !!t && (t.annotations.bold || t.annotations.italic || t.annotations.strikethrough);
}

function renderSegment(
	segment: RichText,
	before: string,
	next: RichText | undefined,
	ctx: Context
): string {
	const { annotations: a } = segment;
	const isEquation = segment.type === 'equation';
	const [, lead, core, trail] = segment.plain_text.match(/^(\s*)([\s\S]*?)(\s*)$/) as string[];
	if (!core) return escapeText(segment.plain_text);

	let text = a.code || isEquation ? codeSpan(core) : escapeText(core);
	if (isEquation) ctx.warn('Inline equations are shown as code; the site has no math renderer.');

	const href = segment.href;
	if (href && NOTION_LINK.test(href)) {
		ctx.warn(`Dropped a link to a Notion page (${href}); link to the published post instead.`);
	} else if (href) {
		text = `[${text}](${linkUrl(href)})`;
	}

	if (a.underline) text = `<u>${text}</u>`;

	if (a.bold || a.italic || a.strikethrough) {
		// Markdown markers only work next to spaces or punctuation. Mid-word, or touching
		// another styled run, fall back to HTML tags so nothing renders as stray asterisks.
		const prevChar = lead ? ' ' : before;
		const nextChar = trail ? ' ' : next?.plain_text[0] ?? '';
		const tagsNeeded =
			WORDLIKE.test(prevChar) || WORDLIKE.test(nextChar) || (!trail && isEmphasized(next));
		if (tagsNeeded) {
			if (a.strikethrough) text = `<s>${text}</s>`;
			if (a.italic) text = `<em>${text}</em>`;
			if (a.bold) text = `<strong>${text}</strong>`;
		} else {
			if (a.strikethrough) text = `~~${text}~~`;
			if (a.italic) text = `*${text}*`;
			if (a.bold) text = `**${text}**`;
		}
	}

	text = colored(text, a.color);
	return escapeText(lead) + text + escapeText(trail);
}
