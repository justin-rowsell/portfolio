<script lang="ts">
	import Contour from '$lib/blog/contour.svelte';
	import Seo from '$lib/seo.svelte';
	import Subscribe from '$lib/blog/subscribe.svelte';
	import TagList from '$lib/blog/tag-list.svelte';
	import { BLOG_IMAGE, BLOG_NAME, SITE_URL } from '$lib/blog/config';
	import { formatDate } from '$lib/blog/format';
	import type { PageData } from './$types';

	export let data: PageData;

	$: post = data.post;
	$: permalink = `${SITE_URL}/blog/${post.slug}`;
</script>

<Seo
	image={post.image ?? BLOG_IMAGE}
	title="{post.title} — Justin Rowsell"
	description={post.summary}
	path="/blog/{post.slug}"
	type="article"
	published={post.date}
	modified={post.updated}
	tags={post.tags.map((t) => t.name)}
/>

<article>
	{#if post.image}
		<div class="banner">
			<img src={post.image} alt="" />
		</div>
	{/if}

	<header class="masthead" class:has-banner={post.image}>
		{#if !post.image}<Contour lines={9} />{/if}
		<div class="masthead-inner narrow">
			<a class="back" href="/blog">
				<span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
				{BLOG_NAME}
			</a>
			<p class="kicker">
				<time datetime={post.date}>{formatDate(post.date)}</time>
				<span class="dot">·</span>
				{post.readingMinutes} min read
				{#if post.draft}<span class="dot">·</span><span class="draft">Draft</span>{/if}
			</p>
			<h1 class="post-title text-balance">{post.title}</h1>
			<TagList tags={post.tags} />
		</div>
	</header>

	<div class="section">
		<div class="narrow">
			{#if post.updated}
				<p class="updated">
					<span class="material-symbols-outlined" aria-hidden="true">history</span>
					First posted {formatDate(post.date)}, revised {formatDate(post.updated)}.
				</p>
			{/if}

			<div class="prose">
				{@html post.html}
			</div>

			<footer class="post-foot">
				<p class="permalink">
					<span class="kicker">Permalink</span>
					<a href="/blog/{post.slug}">{permalink.replace('https://', '')}</a>
				</p>

				{#if data.newer || data.older}
					<nav class="pager" aria-label="More notes">
						{#if data.older}
							<a class="pager-link" href="/blog/{data.older.slug}">
								<span class="kicker">← Older</span>
								<span class="pager-title">{data.older.title}</span>
							</a>
						{:else}<span />{/if}
						{#if data.newer}
							<a class="pager-link newer" href="/blog/{data.newer.slug}">
								<span class="kicker">Newer →</span>
								<span class="pager-title">{data.newer.title}</span>
							</a>
						{/if}
					</nav>
				{/if}

				<Subscribe narrow />
			</footer>
		</div>
	</div>
</article>

<style lang="postcss">
	/* Full-bleed photo below the nav. No fade into the page: on a dark photo it turns muddy. */
	.banner {
		padding-top: 4.5rem;
	}
	.banner img {
		display: block;
		width: 100%;
		height: clamp(220px, 42vw, 62vh);
		object-fit: cover;
		object-position: 50% 40%;
	}
	.masthead.has-banner {
		padding-top: clamp(2rem, 5vw, 3.5rem);
	}

	.narrow {
		max-width: 44rem;
		margin-left: auto;
		margin-right: auto;
	}
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
		transition: transform 0.2s ease;
	}
	.back:hover .material-symbols-outlined {
		transform: translateX(-3px);
	}
	.dot {
		margin: 0 0.35rem;
	}
	.draft {
		color: theme(colors.warning);
	}
	.post-title {
		font-family: theme(fontFamily.display);
		font-weight: 400;
		font-size: clamp(2.3rem, 6vw, 4rem);
		line-height: 1.02;
		letter-spacing: -0.035em;
		color: theme(colors.ink);
		margin: 1rem 0 1.5rem;
	}

	.updated {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 2.5rem 0 0;
		padding: 0.8rem 1rem;
		border-left: 2px solid theme(colors.main);
		background: theme(colors.sand);
		font-size: 0.9rem;
		color: theme(colors.inkSoft);
	}
	.updated .material-symbols-outlined {
		font-size: 1.1rem;
		color: theme(colors.main);
	}

	/* ---------- PROSE ---------- */
	.prose {
		padding-top: clamp(2rem, 5vw, 3rem);
		font-size: 1.125rem;
		line-height: 1.75;
		color: theme(colors.ink);
	}
	.prose :global(> :first-child) {
		margin-top: 0;
	}
	.prose :global(p),
	.prose :global(ul),
	.prose :global(ol),
	.prose :global(pre),
	.prose :global(blockquote),
	.prose :global(figure),
	.prose :global(table) {
		margin: 0 0 1.4em;
	}
	.prose :global(h2),
	.prose :global(h3),
	.prose :global(h4) {
		font-family: theme(fontFamily.display);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.2;
		color: theme(colors.ink);
		margin: 2.2em 0 0.7em;
	}
	.prose :global(h2) {
		font-size: 1.75rem;
	}
	.prose :global(h3) {
		font-size: 1.35rem;
	}
	.prose :global(h4) {
		font-size: 1.1rem;
	}
	.prose :global(a) {
		color: theme(colors.darkAccent);
		text-decoration: underline;
		text-decoration-color: theme(colors.sandDeep);
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}
	.prose :global(a:hover) {
		color: theme(colors.main);
		text-decoration-color: currentColor;
	}
	.prose :global(strong) {
		font-weight: 600;
	}
	.prose :global(ul),
	.prose :global(ol) {
		padding-left: 1.4em;
	}
	.prose :global(ul) {
		list-style: disc;
	}
	.prose :global(ol) {
		list-style: decimal;
	}
	.prose :global(li) {
		margin: 0.35em 0;
	}
	.prose :global(li > ul),
	.prose :global(li > ol) {
		margin: 0.35em 0 0;
	}
	.prose :global(li::marker) {
		color: theme(colors.main);
	}
	.prose :global(blockquote) {
		font-family: theme(fontFamily.display);
		font-style: italic;
		font-size: 1.3rem;
		line-height: 1.5;
		color: theme(colors.inkSoft);
		border-left: 2px solid theme(colors.main);
		padding-left: 1.25rem;
	}
	.prose :global(blockquote p:last-child) {
		margin-bottom: 0;
	}
	.prose :global(code) {
		font-family: theme(fontFamily.mono);
		font-size: 0.88em;
		background: theme(colors.sand);
		border-radius: 0.3rem;
		padding: 0.1em 0.35em;
	}
	.prose :global(pre) {
		background: theme(colors.ink);
		color: theme(colors.paper);
		border-radius: 0.75rem;
		padding: 1.1rem 1.25rem;
		overflow-x: auto;
		font-size: 0.9rem;
		line-height: 1.6;
	}
	.prose :global(pre code) {
		background: none;
		padding: 0;
		font-size: inherit;
		color: inherit;
	}
	.prose :global(hr) {
		border: 0;
		height: 1px;
		background: theme(colors.sandDeep);
		margin: 2.5em 0;
	}
	.prose :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.75rem;
	}
	.prose :global(figure) {
		margin: 2.2em 0;
		text-align: center;
	}
	/* Centered, and capped so tall phone photos don't swallow the screen. */
	.prose :global(figure img) {
		display: block;
		margin: 0 auto;
		max-height: 75vh;
		width: auto;
	}
	.prose :global(figcaption) {
		max-width: 34rem;
		margin: 0.8rem auto 0;
		font-family: theme(fontFamily.display);
		font-style: italic;
		font-size: 0.95rem;
		line-height: 1.5;
		color: theme(colors.inkSoft);
	}
	.prose :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.95rem;
	}
	.prose :global(th),
	.prose :global(td) {
		text-align: left;
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid theme(colors.sandDeep);
	}
	/* Tables without a header row in Notion get an empty one, since markdown needs it. */
	.prose :global(thead:not(:has(th:not(:empty)))) {
		display: none;
	}

	/* ---------- FROM NOTION (see scripts/notion) ---------- */
	.prose :global(u) {
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}
	.prose :global(s),
	.prose :global(del) {
		color: theme(colors.inkSoft);
	}
	.prose :global(mark) {
		color: inherit;
		border-radius: 0.2em;
		padding: 0 0.15em;
	}

	/* Checklists */
	.prose :global(li:has(> input[type='checkbox'])) {
		list-style: none;
		margin-left: -1.4em;
	}
	/* Drawn by hand: browsers grey out disabled checkboxes, which reads as "not done". */
	.prose :global(li > input[type='checkbox']) {
		appearance: none;
		width: 1em;
		height: 1em;
		margin: 0 0.5em 0 0;
		vertical-align: -0.12em;
		border: 1.5px solid theme(colors.inkFaint);
		border-radius: 0.25em;
	}
	.prose :global(li > input[type='checkbox']:checked) {
		border-color: theme(colors.main);
		background: theme(colors.main)
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.5l3 3 6-7' fill='none' stroke='%23F6EFE4' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
			center / 100% no-repeat;
	}

	/* Callouts */
	.prose :global(.callout) {
		display: flex;
		gap: 0.75rem;
		margin: 0 0 1.4em;
		padding: 1rem 1.2rem;
		border-radius: 0.75rem;
		background: theme(colors.sand);
	}
	.prose :global(.callout-icon) {
		flex: none;
		line-height: 1.75;
	}
	.prose :global(.callout-body) {
		flex: 1;
		min-width: 0;
	}
	.prose :global(.callout-body > :last-child) {
		margin-bottom: 0;
	}

	/* Toggles */
	.prose :global(details) {
		margin: 0 0 1.4em;
	}
	.prose :global(summary) {
		cursor: pointer;
	}
	.prose :global(summary::marker) {
		color: theme(colors.main);
	}
	.prose :global(summary > *) {
		display: inline;
		margin: 0;
	}
	.prose :global(details > :not(summary)) {
		margin-left: 1.1em;
	}
	.prose :global(details[open] > summary) {
		margin-bottom: 0.7em;
	}

	/* Columns stack on phones */
	.prose :global(.columns) {
		display: grid;
		gap: 0 1.75rem;
		margin: 0 0 1.4em;
	}
	@media (min-width: 640px) {
		.prose :global(.columns) {
			grid-auto-flow: column;
			grid-auto-columns: minmax(0, 1fr);
		}
	}
	.prose :global(.column > :last-child) {
		margin-bottom: 0;
	}

	/* Video and audio */
	.prose :global(.embed) {
		aspect-ratio: 16 / 9;
		margin: 2.2em 0;
	}
	.prose :global(.embed iframe),
	.prose :global(figure video) {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
		border-radius: 0.75rem;
		background: theme(colors.ink);
	}
	.prose :global(figure audio) {
		width: 100%;
	}

	/* Notion's text and background colors, tuned for the cream page */
	.prose :global(.notion-gray) {
		color: #7d756c;
	}
	.prose :global(.notion-brown) {
		color: #93603f;
	}
	.prose :global(.notion-orange) {
		color: #c4610b;
	}
	.prose :global(.notion-yellow) {
		color: #a87a12;
	}
	.prose :global(.notion-green) {
		color: #3f7a5a;
	}
	.prose :global(.notion-blue) {
		color: #2e6f98;
	}
	.prose :global(.notion-purple) {
		color: #7f55a3;
	}
	.prose :global(.notion-pink) {
		color: #b13f7c;
	}
	.prose :global(.notion-red) {
		color: #c63a35;
	}
	.prose :global(.notion-gray_background) {
		background: rgba(125, 117, 108, 0.14);
	}
	.prose :global(.notion-brown_background) {
		background: rgba(147, 96, 63, 0.14);
	}
	.prose :global(.notion-orange_background) {
		background: rgba(217, 115, 13, 0.16);
	}
	.prose :global(.notion-yellow_background) {
		background: rgba(230, 180, 40, 0.26);
	}
	.prose :global(.notion-green_background) {
		background: rgba(68, 131, 97, 0.15);
	}
	.prose :global(.notion-blue_background) {
		background: rgba(51, 126, 169, 0.14);
	}
	.prose :global(.notion-purple_background) {
		background: rgba(144, 101, 176, 0.14);
	}
	.prose :global(.notion-pink_background) {
		background: rgba(193, 76, 138, 0.14);
	}
	.prose :global(.notion-red_background) {
		background: rgba(212, 76, 71, 0.14);
	}

	/* ---------- FOOT ---------- */
	.post-foot {
		display: grid;
		gap: 2rem;
		margin-top: clamp(2.5rem, 6vw, 4rem);
		padding-top: 2rem;
		border-top: 1px solid theme(colors.sandDeep);
	}
	.permalink {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.4rem 0.8rem;
		margin: 0;
	}
	.permalink a {
		font-family: theme(fontFamily.mono);
		font-size: 0.8rem;
		color: theme(colors.inkSoft);
		word-break: break-all;
	}
	.permalink a:hover {
		color: theme(colors.main);
	}
	.pager {
		display: grid;
		gap: 1rem;
	}
	@media (min-width: 640px) {
		.pager {
			grid-template-columns: 1fr 1fr;
		}
	}
	.pager-link {
		display: grid;
		gap: 0.4rem;
		padding: 1rem 1.2rem;
		border: 1px solid theme(colors.sandDeep);
		border-radius: 1rem;
		transition: border-color 0.2s ease, transform 0.2s ease;
	}
	.pager-link:hover {
		border-color: theme(colors.main);
		transform: translateY(-2px);
	}
	.pager-link.newer {
		text-align: right;
	}
	.pager-title {
		font-family: theme(fontFamily.display);
		font-size: 1.1rem;
		line-height: 1.3;
		color: theme(colors.ink);
	}
</style>
