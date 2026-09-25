import { getPosts, getTags, toMeta } from '$lib/server/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		posts: getPosts().map(toMeta),
		tags: getTags()
	};
};
