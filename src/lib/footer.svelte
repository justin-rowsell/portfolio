<script lang="ts">
	import favicon from '$lib/assets/favicon.png';
	export let footerTitle: string;
</script>

<footer
	class="footer p-10 text-neutral-content flex flex-row w-min-screen items-stretch mt-16 py-16 border-t-2 border-black"
>
	<div class="flex w-full">
		<a href="https://aquaberry.io">
			<img class="mr-3 h-12" src={favicon} alt="Aquaberry Icon" />
		</a>
		<p class="text-darkAccent text-md">
			This is an Aquaberry Jam<br />Building software for tomorrow
		</p>
	</div>
	<div class="flex flex-col w-full">
		<span class="footer-title text-xl text-accent">{footerTitle}</span>
		<div class="flex flex-row">
			<slot />
		</div>
	</div>
</footer>
