import { error } from '@sveltejs/kit';
import { getPosts, toMeta } from '$lib/server/posts';
import type { EntryGenerator, PageServerLoad } from './$types';

// 'auto' so the build still passes before any post (or tag) exists.
export const prerender = 'auto';

export const entries: EntryGenerator = () => getPosts().map(({ slug }) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
	const posts = getPosts();
	const index = posts.findIndex((post) => post.slug === params.slug);
	if (index === -1) throw error(404, 'Not found');

	const newer = posts[index - 1];
	const older = posts[index + 1];

	return {
		post: posts[index],
		newer: newer ? toMeta(newer) : null,
		older: older ? toMeta(older) : null
	};
};
