<script lang="ts">
	// The Brainmade mark (brainmade.org): a public-domain (CC0) sign that a person, not AI,
	// made the work. It's an honor system; their bar is roughly 90% human-made.
	import brainmade from '$lib/assets/brainmade.svg';
</script>

<a class="brainmade" href="https://brainmade.org" target="_blank" rel="noreferrer">
	<img src={brainmade} alt="Brainmade: written by a human" width="256" height="80" />
</a>

<style lang="postcss">
	.brainmade {
		display: inline-block;
		flex: none;
		opacity: 0.85;
		transition: opacity 0.2s ease;
	}
	.brainmade:hover {
		opacity: 1;
	}
	.brainmade img {
		display: block;
		height: 36px;
		width: auto;
	}
</style>
