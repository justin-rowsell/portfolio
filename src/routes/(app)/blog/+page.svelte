<script lang="ts">
	import Contour from '$lib/blog/contour.svelte';
	import Seo from '$lib/seo.svelte';
	import Subscribe from '$lib/blog/subscribe.svelte';
	import TagList from '$lib/blog/tag-list.svelte';
	import { BLOG_DESCRIPTION, BLOG_TITLE } from '$lib/blog/config';
	import { formatDayMonth, yearOf } from '$lib/blog/format';
	import type { PageData } from './$types';

	export let data: PageData;

	$: years = data.posts.reduce<{ year: string; posts: typeof data.posts }[]>((groups, post) => {
		const year = yearOf(post.date);
		const last = groups[groups.length - 1];
		if (last?.year === year) last.posts.push(post);
		else groups.push({ year, posts: [post] });
		return groups;
	}, []);
</script>

<Seo title={BLOG_TITLE} description={BLOG_DESCRIPTION} path="/blog" />

<header class="masthead">
	<Contour lines={12} />
	<div class="masthead-inner">
		<p class="kicker">
			Field notes{#if data.posts.length}
				· {data.posts.length} {data.posts.length === 1 ? 'entry' : 'entries'}{/if}
		</p>
		<h1 class="title">Notes from<br />the field</h1>
		<p class="lede text-balance">
			Short, dated notes on what I’m building, learning, and still confused about. The early,
			half-formed takes stay up on purpose — they’re the record of how I got here.
		</p>
		{#if data.tags.length}
			<div class="tag-row">
				<span class="kicker">Follow a trail</span>
				<TagList tags={data.tags} />
			</div>
		{/if}
	</div>
</header>

<section class="section log">
	{#each years as group}
		<div class="year-group">
			<h2 class="year">{group.year}</h2>
			<ol class="entries">
				{#each group.posts as post}
					<li class="entry">
						<time class="date" datetime={post.date}>{formatDayMonth(post.date)}</time>
						<div class="body">
							<h3 class="entry-title">
								<a class="entry-link" href="/blog/{post.slug}">{post.title}</a>
								{#if post.draft}<span class="draft">Draft</span>{/if}
							</h3>
							{#if post.summary}<p class="summary">{post.summary}</p>{/if}
							<div class="meta">
								<span class="kicker">{post.readingMinutes} min read</span>
								<TagList tags={post.tags} />
							</div>
						</div>
						<span class="arrow material-symbols-outlined" aria-hidden="true">arrow_outward</span>
					</li>
				{/each}
			</ol>
		</div>
	{:else}
		<div class="empty">
			<span class="material-symbols-outlined" aria-hidden="true">explore</span>
			<p>The first note is on its way. Subscribe below to get it when it lands.</p>
		</div>
	{/each}

	<div class="subscribe-wrap">
		<Subscribe />
	</div>
</section>

<style lang="postcss">
	.title {
		font-family: theme(fontFamily.display);
		font-weight: 400;
		font-size: clamp(3rem, 9vw, 6.5rem);
		line-height: 0.95;
		letter-spacing: -0.04em;
		color: theme(colors.ink);
		margin: 1rem 0 1.5rem;
	}
	.lede {
		max-width: 38rem;
		font-size: clamp(1.05rem, 1.6vw, 1.2rem);
		line-height: 1.65;
		color: theme(colors.inkSoft);
		margin: 0;
	}
	.tag-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem 1rem;
		margin-top: 2rem;
	}

	.log {
		padding-top: clamp(2.5rem, 6vw, 4rem);
	}
	.year-group {
		display: grid;
		gap: 0.5rem;
		margin-bottom: clamp(2.5rem, 6vw, 4rem);
	}
	@media (min-width: 900px) {
		.year-group {
			grid-template-columns: 9rem 1fr;
			gap: 2rem;
		}
		.year {
			position: sticky;
			top: 5rem;
			align-self: start;
		}
	}
	.year {
		font-family: theme(fontFamily.display);
		font-weight: 300;
		font-size: clamp(2rem, 4vw, 3rem);
		letter-spacing: -0.03em;
		color: theme(colors.main);
		margin: 0;
	}
	.entries {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid theme(colors.sandDeep);
	}
	.entry {
		position: relative;
		display: grid;
		grid-template-columns: 4.5rem 1fr auto;
		gap: 1rem;
		padding: 1.6rem 0;
		border-bottom: 1px solid theme(colors.sandDeep);
		transition: background 0.2s ease;
	}
	.entry:hover {
		background: linear-gradient(
			to right,
			rgba(235, 224, 206, 0),
			theme(colors.sand) 20%,
			rgba(235, 224, 206, 0)
		);
	}
	.date {
		font-family: theme(fontFamily.mono);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		color: theme(colors.inkFaint);
		padding-top: 0.45rem;
	}
	.entry-title {
		font-family: theme(fontFamily.display);
		font-weight: 400;
		font-size: clamp(1.35rem, 2.4vw, 1.75rem);
		line-height: 1.2;
		letter-spacing: -0.015em;
		margin: 0;
	}
	.entry-link {
		color: theme(colors.ink);
	}
	/* Whole row is clickable; tags sit above the stretched link. */
	.entry-link::after {
		content: '';
		position: absolute;
		inset: 0;
	}
	.entry:hover .entry-link {
		color: theme(colors.main);
	}
	.summary {
		margin: 0.5rem 0 0;
		max-width: 44rem;
		line-height: 1.6;
		color: theme(colors.inkSoft);
	}
	.meta {
		position: relative;
		z-index: 1;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 1rem;
		margin-top: 0.9rem;
	}
	.arrow {
		color: theme(colors.inkFaint);
		padding-top: 0.35rem;
		transition: transform 0.2s ease, color 0.2s ease;
	}
	.entry:hover .arrow {
		color: theme(colors.main);
		transform: translate(3px, -3px);
	}
	.draft {
		vertical-align: middle;
		font-family: theme(fontFamily.mono);
		font-size: 0.65rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: theme(colors.paper);
		background: theme(colors.warning);
		border-radius: 9999px;
		padding: 0.15rem 0.55rem;
		margin-left: 0.4rem;
	}
	@media (max-width: 640px) {
		.entry {
			grid-template-columns: 1fr;
			gap: 0.4rem;
		}
		.date {
			padding-top: 0;
		}
		.arrow {
			display: none;
		}
	}

	.empty {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 2.5rem 0;
		color: theme(colors.inkSoft);
		font-family: theme(fontFamily.display);
		font-size: 1.25rem;
	}
	.empty .material-symbols-outlined {
		font-size: 2rem;
		color: theme(colors.main);
	}
	.subscribe-wrap {
		margin-top: clamp(1rem, 4vw, 2rem);
	}
</style>
