<script lang="ts">
	// The official "Written by Human, Not by AI" badge from notbyai.fyi (free for personal use).
	// Their rules: never alter it, show it at least 42px tall, leave clear space around it,
	// and link it to notbyai.fyi. Renders nothing until the badge file is added to src/lib/assets.
	const files = import.meta.glob('../assets/not-by-ai.{svg,png}', { eager: true, as: 'url' });
	const badge = Object.values(files)[0];
</script>

{#if badge}
	<a class="not-by-ai" href="https://notbyai.fyi" target="_blank" rel="noreferrer">
		<img src={badge} alt="Written by Human, Not by AI" />
	</a>
{/if}

<style lang="postcss">
	.not-by-ai {
		display: inline-block;
		flex: none;
		/* Clear space the guidelines ask for */
		padding: 0.4rem;
		margin: -0.4rem;
	}
	.not-by-ai img {
		display: block;
		height: 42px;
		width: auto;
	}
</style>
