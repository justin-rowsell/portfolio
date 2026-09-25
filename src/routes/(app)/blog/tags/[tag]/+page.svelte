<script lang="ts">
	import Contour from '$lib/blog/contour.svelte';
	import Seo from '$lib/seo.svelte';
	import { BLOG_IMAGE, BLOG_NAME, BLOG_TITLE } from '$lib/blog/config';
	import Subscribe from '$lib/blog/subscribe.svelte';
	import TagList from '$lib/blog/tag-list.svelte';
	import { formatDate } from '$lib/blog/format';
	import type { PageData } from './$types';

	export let data: PageData;

	$: first = data.posts[0];
	$: since = first
		? new Date(`${first.date}T00:00:00Z`).toLocaleDateString('en-US', {
				timeZone: 'UTC',
				month: 'long',
				year: 'numeric'
		  })
		: '';
</script>

<Seo
	image={BLOG_IMAGE}
	title="{data.tag.name} — {BLOG_TITLE}"
	description="Everything I’ve written about {data.tag.name}, oldest first."
	path="/blog/tags/{data.tag.slug}"
/>

<header class="masthead">
	<Contour lines={10} />
	<div class="masthead-inner">
		<a class="back" href="/blog">
			<span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
			{BLOG_NAME}
		</a>
		<p class="kicker">
			Trail · {data.posts.length}
			{data.posts.length === 1 ? 'note' : 'notes'} since {since}
		</p>
		<h1 class="title">{data.tag.name}</h1>
		<p class="lede text-balance">
			Everything I’ve written on this, oldest first — including the takes I’ve since changed my mind
			about.
		</p>
		<div class="tag-row">
			<TagList tags={data.tags} active={data.tag.slug} />
		</div>
	</div>
</header>

<section class="section">
	<ol class="trail">
		{#each data.posts as post, i}
			<li class="waypoint" class:latest={i === data.posts.length - 1}>
				<span class="marker" aria-hidden="true" />
				<div class="waypoint-body">
					<p class="kicker">
						<time datetime={post.date}>{formatDate(post.date)}</time>
						{#if i === data.posts.length - 1}<span class="here">· Latest</span>{/if}
					</p>
					<h2 class="waypoint-title">
						<a href="/blog/{post.slug}">{post.title}</a>
					</h2>
					{#if post.summary}<p class="summary">{post.summary}</p>{/if}
				</div>
			</li>
		{/each}
	</ol>

	<Subscribe />
</section>

<style lang="postcss">
	.back {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-family: theme(fontFamily.mono);
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		color: theme(colors.inkSoft);
		margin-bottom: 2rem;
	}
	.back .material-symbols-outlined {
		font-size: 1rem;
	}
	.title {
		font-family: theme(fontFamily.display);
		font-weight: 400;
		font-size: clamp(2.8rem, 8vw, 5.5rem);
		line-height: 0.98;
		letter-spacing: -0.04em;
		color: theme(colors.ink);
		margin: 1rem 0 1.25rem;
	}
	.lede {
		max-width: 36rem;
		font-size: 1.1rem;
		line-height: 1.65;
		color: theme(colors.inkSoft);
		margin: 0;
	}
	.tag-row {
		margin-top: 2rem;
	}

	/* A dashed route line with a waypoint per post. */
	.trail {
		position: relative;
		list-style: none;
		margin: clamp(2.5rem, 6vw, 4rem) 0;
		padding: 0 0 0 2.25rem;
		max-width: 46rem;
	}
	.trail::before {
		content: '';
		position: absolute;
		left: 0.55rem;
		top: 0.6rem;
		bottom: 0.6rem;
		border-left: 2px dashed theme(colors.sandDeep);
	}
	.waypoint {
		position: relative;
		padding-bottom: 2.25rem;
	}
	.waypoint:last-child {
		padding-bottom: 0;
	}
	.marker {
		position: absolute;
		left: -2.25rem;
		top: 0.2rem;
		width: 1.2rem;
		height: 1.2rem;
		border-radius: 9999px;
		background: theme(colors.paper);
		border: 2px solid theme(colors.inkFaint);
	}
	.latest .marker {
		background: theme(colors.main);
		border-color: theme(colors.main);
		box-shadow: 0 0 0 5px rgba(220, 0, 0, 0.15);
	}
	.here {
		color: theme(colors.main);
	}
	.waypoint-title {
		font-family: theme(fontFamily.display);
		font-weight: 400;
		font-size: clamp(1.3rem, 2.4vw, 1.65rem);
		line-height: 1.25;
		letter-spacing: -0.015em;
		margin: 0.4rem 0 0;
	}
	.waypoint-title a {
		color: theme(colors.ink);
	}
	.waypoint-title a:hover {
		color: theme(colors.main);
	}
	.summary {
		margin: 0.45rem 0 0;
		line-height: 1.6;
		color: theme(colors.inkSoft);
	}
</style>
