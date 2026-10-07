// Prepare a post for pasting into Substack or Indie Hackers.
//
//   npm run crosspost                  # newest post
//   npm run crosspost why-i-killed-it  # a specific post
//
// Writes crosspost/<slug>.html and opens it. The page has copy buttons for the
// title, subtitle, rich-text body (Substack) and markdown body (Indie Hackers).
// Links and images point back at the site, and the body ends with an
// "originally published" line so the copy credits the original.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BLOG_NAME, SITE_URL } from '../src/lib/blog/config.ts';
import { parseFrontmatter } from '../src/lib/blog/frontmatter.ts';
import { renderMarkdown } from '../src/lib/blog/markdown.ts';

const POSTS = 'src/posts';
const OUT = 'crosspost';

function fail(message: string): never {
	console.error(message);
	process.exit(1);
}

function escape(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function newestSlug(): string {
	const dated = readdirSync(POSTS)
		.filter((file) => file.endsWith('.md'))
		.map((file) => {
			const { data } = parseFrontmatter(readFileSync(join(POSTS, file), 'utf8'));
			return { slug: file.replace(/\.md$/, ''), date: String(data.date ?? '') };
		})
		.sort((a, b) => b.date.localeCompare(a.date));
	if (!dated[0]) fail(`No posts in ${POSTS}/`);
	return dated[0].slug;
}

const slug = process.argv[2] ?? newestSlug();
let source: string;
try {
	source = readFileSync(join(POSTS, `${slug}.md`), 'utf8');
} catch {
	fail(`No post at ${POSTS}/${slug}.md`);
}

const { data, body } = parseFrontmatter(source);
const title = String(data.title ?? slug);
const summary = typeof data.summary === 'string' ? data.summary : '';
const url = `${SITE_URL}/blog/${slug}`;
if (data.draft === true) console.warn(`Note: ${slug} is still a draft, so ${url} won't exist yet.`);

// Root-relative links and images would point at Substack/IH, so aim them at the site.
const markdown =
	body.trim().replace(/(\]\()\/(?!\/)/g, `$1${SITE_URL}/`) +
	`\n\n---\n\n*Originally published on [${BLOG_NAME}](${url}).*\n`;
const html = renderMarkdown(markdown).replace(/(href|src)="\/(?!\/)/g, `$1="${SITE_URL}/`);

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Cross-post: ${escape(title)}</title>
<style>
	body { font: 16px/1.6 -apple-system, system-ui, sans-serif; color: #222; background: #faf8f4; max-width: 46rem; margin: 2rem auto; padding: 0 1rem; }
	h1 { font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; color: #888; }
	.field { display: flex; gap: 0.75rem; align-items: baseline; margin: 0.5rem 0; }
	.field span { flex: 1; }
	.label { flex: 0 0 5.5rem !important; color: #888; font-size: 0.85rem; }
	button { font: inherit; font-size: 0.85rem; padding: 0.35rem 0.9rem; border: 1px solid #ccc; border-radius: 999px; background: #fff; cursor: pointer; }
	button.done { background: #2a7a4b; border-color: #2a7a4b; color: #fff; }
	.bar { display: flex; gap: 0.5rem; margin: 1.5rem 0 1rem; }
	article { background: #fff; border: 1px solid #e5e0d8; border-radius: 0.75rem; padding: 1.5rem 2rem; }
	article img { max-width: 100%; height: auto; }
	figure { margin: 1.5rem 0; text-align: center; }
	figcaption { font-size: 0.85rem; color: #777; }
	textarea { position: absolute; left: -9999px; }
</style>
</head>
<body>
<h1>Cross-post</h1>
<div class="field"><span class="label">Title</span><span id="title">${escape(
	title
)}</span><button data-copy="title">Copy</button></div>
<div class="field"><span class="label">Subtitle</span><span id="summary">${escape(
	summary
)}</span><button data-copy="summary">Copy</button></div>
<div class="field"><span class="label">Original</span><span><a href="${url}">${url}</a></span></div>
<div class="bar">
	<button data-copy="body">Copy body for Substack</button>
	<button data-copy="markdown">Copy markdown for Indie Hackers</button>
</div>
<article id="body">${html}</article>
<textarea id="markdown">${escape(markdown)}</textarea>
<script>
	// Selecting and copying keeps formatting for rich editors like Substack,
	// and works from a file:// page where the async clipboard API may not.
	function copy(el) {
		const selection = getSelection();
		selection.removeAllRanges();
		if (el.tagName === 'TEXTAREA') {
			el.select();
		} else {
			const range = document.createRange();
			range.selectNodeContents(el);
			selection.addRange(range);
		}
		document.execCommand('copy');
		selection.removeAllRanges();
	}
	for (const button of document.querySelectorAll('[data-copy]')) {
		const label = button.textContent;
		button.addEventListener('click', () => {
			copy(document.getElementById(button.dataset.copy));
			button.textContent = 'Copied';
			button.classList.add('done');
			setTimeout(() => {
				button.textContent = label;
				button.classList.remove('done');
			}, 1500);
		});
	}
</script>
</body>
</html>
`;

mkdirSync(OUT, { recursive: true });
const file = join(OUT, `${slug}.html`);
writeFileSync(file, page);
console.log(`Wrote ${file}`);
try {
	execFileSync('open', [file]);
} catch {
	// Not on a Mac; open the file by hand.
}
