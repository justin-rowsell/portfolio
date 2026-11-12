<script lang="ts">
	import { SITE_URL } from './blog/config';
	import { toJsonLd, type Schema } from './schema';

	export let title: string;
	export let description: string;
	export let path: string;
	export let type: 'website' | 'article' = 'website';
	export let published: string | undefined = undefined;
	export let modified: string | undefined = undefined;
	export let tags: string[] = [];
	/** Root-relative path to a link-preview image */
	export let image: string | undefined = undefined;
	/** Describes the link-preview image, for screen readers on sites that show it */
	export let imageAlt: string | undefined = undefined;
	/** schema.org structured data, rendered as JSON-LD */
	export let schema: Schema | Schema[] | undefined = undefined;

	$: url = `${SITE_URL}${path}`;
	$: jsonLd = schema && toJsonLd(schema);
</script>

<svelte:head>
	<title>{title}</title>
	{#if description}<meta name="description" content={description} />{/if}
	<link rel="canonical" href={url} />
	<meta property="og:title" content={title} />
	{#if description}<meta property="og:description" content={description} />{/if}
	<meta property="og:site_name" content="Justin Rowsell" />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	{#if image}
		<meta property="og:image" content="{SITE_URL}{image}" />
		{#if imageAlt}
			<meta property="og:image:alt" content={imageAlt} />
			<meta name="twitter:image:alt" content={imageAlt} />
		{/if}
		<meta name="twitter:card" content="summary_large_image" />
	{:else}
		<meta name="twitter:card" content="summary" />
	{/if}
	{#if published}<meta property="article:published_time" content={published} />{/if}
	{#if modified}<meta property="article:modified_time" content={modified} />{/if}
	{#each tags as tag}<meta property="article:tag" content={tag} />{/each}
	{#if jsonLd}{@html `<script type="application/ld+json">${jsonLd}</script>`}{/if}
</svelte:head>
