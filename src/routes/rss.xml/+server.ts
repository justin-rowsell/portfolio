import { BLOG_DESCRIPTION, BLOG_TITLE, SITE_URL } from '$lib/blog/config';
import { toRfc822 } from '$lib/blog/format';
import { getPosts } from '$lib/server/posts';
import type { RequestHandler } from './$types';

// Buttondown's RSS-to-email reads this feed, so it carries the full post body.
export const prerender = true;

function escape(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function cdata(html: string): string {
	return `<![CDATA[${html.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

// Root-relative links would break inside an email, so point them at the site.
function absolutize(html: string): string {
	return html.replace(/(href|src)="\/(?!\/)/g, `$1="${SITE_URL}/`);
}

export const GET: RequestHandler = () => {
	const posts = getPosts().filter((post) => !post.draft);
	const feedUrl = `${SITE_URL}/rss.xml`;

	const items = posts
		.map((post) => {
			const url = `${SITE_URL}/blog/${post.slug}`;
			return `
    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(post.date)}</pubDate>
      <description>${escape(post.summary)}</description>
      <content:encoded>${cdata(absolutize(post.html))}</content:encoded>
${post.tags.map((tag) => `      <category>${escape(tag.name)}</category>`).join('\n')}
    </item>`;
		})
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escape(BLOG_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escape(BLOG_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${
	posts[0]
		? `    <lastBuildDate>${toRfc822(posts[0].updated ?? posts[0].date)}</lastBuildDate>\n`
		: ''
}${items}
  </channel>
</rss>
`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
	});
};
