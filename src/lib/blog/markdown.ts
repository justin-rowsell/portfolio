import { marked } from 'marked';

const renderer = new marked.Renderer();
const renderImage = renderer.image.bind(renderer);
const renderParagraph = renderer.paragraph.bind(renderer);

renderer.image = (href, title, text) => {
	// Let marked clean the URL, then add lazy loading.
	const img = renderImage(href, title, text);
	return img.startsWith('<img') ? img.replace('<img', '<img loading="lazy" decoding="async"') : img;
};

// An image on its own line becomes a centered figure; its "title" is the caption:
// ![Alt text](/images/post/photo.jpg "Caption under the photo")
const LONE_IMAGE = /^(<img [^>]*?)(?: title="([^"]*)")?>$/;

renderer.paragraph = (text) => {
	const match = text.trim().match(LONE_IMAGE);
	if (!match) return renderParagraph(text);

	const [, img, caption] = match;
	return `<figure>${img}>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>\n`;
};

// The post title is the page's only <h1>, so a body that starts its outline at `#` (Notion's
// "Heading 1") is shifted down a level: # → <h2>, ## → <h3>, and so on.
export function renderMarkdown(markdown: string): string {
	const options = { ...marked.defaults, renderer };
	const tokens = marked.lexer(markdown, options);
	let top = 6;
	marked.walkTokens(tokens, (token) => {
		if (token.type === 'heading') top = Math.min(top, token.depth);
	});
	if (top === 1) {
		marked.walkTokens(tokens, (token) => {
			if (token.type === 'heading') token.depth = Math.min(6, token.depth + 1);
		});
	}
	return marked.parser(tokens, options);
}
