export interface Tag {
	name: string;
	slug: string;
}

export interface PostMeta {
	/** Permanent URL segment: /blog/{slug}. Comes from the filename. */
	slug: string;
	title: string;
	/** YYYY-MM-DD */
	date: string;
	/** YYYY-MM-DD, set when a post is revised after publishing */
	updated?: string;
	summary: string;
	tags: Tag[];
	draft: boolean;
	readingMinutes: number;
}

export interface Post extends PostMeta {
	html: string;
}

export interface TagSummary extends Tag {
	count: number;
}
