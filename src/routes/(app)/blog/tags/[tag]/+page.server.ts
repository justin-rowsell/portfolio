import { error } from '@sveltejs/kit';
import { getPosts, getTags, toMeta } from '$lib/server/posts';
import type { EntryGenerator, PageServerLoad } from './$types';

// 'auto' so the build still passes before any post (or tag) exists.
export const prerender = 'auto';

export const entries: EntryGenerator = () => getTags().map(({ slug }) => ({ tag: slug }));

export const load: PageServerLoad = ({ params }) => {
	const tags = getTags();
	const tag = tags.find((t) => t.slug === params.tag);
	if (!tag) throw error(404, 'Not found');

	// Oldest first: a tag page reads as the trail of how my thinking moved.
	const posts = getPosts()
		.filter((post) => post.tags.some((t) => t.slug === tag.slug))
		.reverse()
		.map(toMeta);

	return { tag, tags, posts };
};
