<script lang="ts">
	import Contour from '$lib/blog/contour.svelte';
	import Seo from '$lib/seo.svelte';
	import Subscribe from '$lib/blog/subscribe.svelte';
	import TagList from '$lib/blog/tag-list.svelte';
	import { SITE_URL } from '$lib/blog/config';
	import { formatDate } from '$lib/blog/format';
	import type { PageData } from './$types';

	export let data: PageData;

	$: post = data.post;
	$: permalink = `${SITE_URL}/blog/${post.slug}`;
</script>

<Seo
	title="{post.title} — Justin Rowsell"
	description={post.summary}
	path="/blog/{post.slug}"
	type="article"
	published={post.date}
	modified={post.updated}
	tags={post.tags.map((t) => t.name)}
/>

<article>
	<header class="masthead">
		<Contour lines={9} />
		<div class="masthead-inner narrow">
			<a class="back" href="/blog">
				<span class="material-symbols-outlined" aria-hidden="true">arrow_back</span> All notes
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
