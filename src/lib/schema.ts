// schema.org structured data (JSON-LD) for search engines. Only facts already published on the site.
import headshot from '$lib/assets/headshot.jpeg';
import { BLOG_DESCRIPTION, BLOG_IMAGE, BLOG_NAME, SITE_URL } from '$lib/blog/config';
import type { PostMeta } from '$lib/blog/types';

export type Schema = Record<string, unknown>;

const PERSON_ID = `${SITE_URL}/#person`;
const BLOG_ID = `${SITE_URL}/blog#blog`;

const author = { '@type': 'Person', '@id': PERSON_ID, name: 'Justin Rowsell', url: SITE_URL };

export const person: Schema = {
	...author,
	image: `${SITE_URL}${headshot}`,
	jobTitle: 'Founder',
	worksFor: { '@type': 'Organization', name: 'Aquaberry', url: 'https://aquaberry.io' },
	knowsAbout: ['Software', 'AI', 'Product', 'GIS', 'Climate', 'Fiber infrastructure'],
	sameAs: ['https://www.linkedin.com/in/justin-rowsell/']
};

export const website: Schema = {
	'@type': 'WebSite',
	'@id': `${SITE_URL}/#website`,
	name: 'Justin Rowsell',
	url: SITE_URL,
	inLanguage: 'en',
	publisher: { '@id': PERSON_ID }
};

export const blog: Schema = {
	'@type': 'Blog',
	'@id': BLOG_ID,
	name: BLOG_NAME,
	description: BLOG_DESCRIPTION,
	url: `${SITE_URL}/blog`,
	image: `${SITE_URL}${BLOG_IMAGE}`,
	inLanguage: 'en',
	author
};

export function blogPosting(post: PostMeta): Schema {
	const url = `${SITE_URL}/blog/${post.slug}`;
	return {
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		headline: post.title,
		...(post.summary && { description: post.summary }),
		url,
		mainEntityOfPage: url,
		datePublished: post.date,
		dateModified: post.updated ?? post.date,
		image: `${SITE_URL}${post.image ?? BLOG_IMAGE}`,
		keywords: post.tags.map((tag) => tag.name),
		inLanguage: 'en',
		author,
		publisher: author,
		isPartOf: { '@type': 'Blog', '@id': BLOG_ID, name: BLOG_NAME, url: `${SITE_URL}/blog` }
	};
}

/** Serialized for a <script type="application/ld+json"> tag. */
export function toJsonLd(schema: Schema | Schema[]): string {
	const doc = Array.isArray(schema)
		? { '@context': 'https://schema.org', '@graph': schema }
		: { '@context': 'https://schema.org', ...schema };
	// A "</script>" inside a string would end the tag early.
	return JSON.stringify(doc).replace(/</g, '\\u003c');
}
