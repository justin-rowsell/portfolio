<script lang="ts">
	import { SITE_URL } from './blog/config';

	export let title: string;
	export let description: string;
	export let path: string;
	export let type: 'website' | 'article' = 'website';
	export let published: string | undefined = undefined;
	export let modified: string | undefined = undefined;
	export let tags: string[] = [];
	/** Root-relative path to a link-preview image */
	export let image: string | undefined = undefined;

	$: url = `${SITE_URL}${path}`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	{#if image}
		<meta property="og:image" content="{SITE_URL}{image}" />
		<meta name="twitter:card" content="summary_large_image" />
	{:else}
		<meta name="twitter:card" content="summary" />
	{/if}
	{#if published}<meta property="article:published_time" content={published} />{/if}
	{#if modified}<meta property="article:modified_time" content={modified} />{/if}
	{#each tags as tag}<meta property="article:tag" content={tag} />{/each}
</svelte:head>
