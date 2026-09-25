<script lang="ts">
	import SiteFooter from '$lib/site-footer.svelte';
	import { BLOG_TITLE } from '$lib/blog/config';
</script>

<svelte:head>
	<link rel="alternate" type="application/rss+xml" title={BLOG_TITLE} href="/rss.xml" />
</svelte:head>

<div class="blog">
	<slot />
</div>
<SiteFooter />

<style lang="postcss">
	.blog {
		min-height: 70vh;
		padding-bottom: clamp(3rem, 8vw, 6rem);
	}

	/* Shared type for all blog pages */
	.blog :global(.kicker) {
		font-family: theme(fontFamily.mono);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: theme(colors.inkFaint);
		font-size: 0.72rem;
		margin: 0;
	}
	.blog :global(.masthead) {
		position: relative;
		overflow: hidden;
		padding: clamp(7rem, 14vw, 10rem) clamp(1.5rem, 5vw, 5rem) clamp(2.5rem, 6vw, 4rem);
		border-bottom: 1px solid theme(colors.sandDeep);
	}
	.blog :global(.masthead-inner) {
		position: relative;
		z-index: 1;
		max-width: 1100px;
		margin: 0 auto;
	}
	.blog :global(.section) {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 clamp(1.5rem, 5vw, 5rem);
	}
	@media (min-width: 1100px) {
		.blog :global(.section) {
			padding: 0;
		}
	}
</style>
