<svelte:head>
    <title>Thanks — Justin Rowsell</title>
    <meta name="robots" content="noindex" />
</svelte:head>

<!--Basic html page with message indicating their submission was successful. 
    Then the page will automatically redirect back to the home page-->
<div class="ml-auto mr-auto text-center pt-16">
    <h1>Thank you for your submission!</h1>
    <p>You will be redirected back to the home page in 5 seconds.</p>
</div>

<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    onMount(() => {
        setTimeout(() => {
            goto(`/`, { replaceState: true });
        }, 5000);
    });
</script>