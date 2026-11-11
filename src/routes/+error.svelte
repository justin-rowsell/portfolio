<script>
    import { page } from '$app/stores';
</script>

<svelte:head>
    <title>{$page.status === 404 ? 'Not found' : 'Error'} — Justin Rowsell</title>
    <meta name="robots" content="noindex" />
</svelte:head>

<!--Show error message with 5xl font centered in page-->
<div class="flex flex-col items-center justify-start h-screen">
    <h1 class="text-5xl p-16">Error</h1>
    <p class="text-2xl">{$page.error?.message ?? 'Something went wrong.'}</p>
</div>
