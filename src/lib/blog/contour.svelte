<script lang="ts">
	// Faint topographic contour lines, same motif as the home page hero.
	export let lines = 10;

	const path =
		'M0,0 C100,-16 200,16 300,0 C400,-16 500,16 600,0 C700,-16 800,16 900,0 C1000,-16 1100,16 1200,0';
	$: offsets = Array.from({ length: lines }, (_, i) => i * 38);
</script>

<svg
	class="contour"
	viewBox="0 0 1200 {lines * 38}"
	preserveAspectRatio="xMidYMid slice"
	aria-hidden="true"
>
	{#each offsets as y}
		<path d={path} transform="translate(0,{y})" />
	{/each}
</svg>

<style lang="postcss">
	.contour {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		color: theme(colors.sandDeep);
		opacity: 0.5;
		z-index: 0;
		pointer-events: none;
	}
	.contour path {
		fill: none;
		stroke: currentColor;
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}
</style>
