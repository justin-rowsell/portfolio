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

export function renderMarkdown(markdown: string): string {
	return marked.parse(markdown, { renderer });
}
