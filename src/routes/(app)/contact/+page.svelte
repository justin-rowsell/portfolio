<svelte:head>
  <title>Justin Rowsell | Contact</title>
  <meta name="description" content="Contact Justin Rowsell today" />
</svelte:head>
<div class="lg:w-1/2 md:w-3/4 w-11/12 m-auto shadow-xl p-4 bg-lightShade"> 
    <h1 class="text-2xl font-bold text-center text-darkShade">Contact Me</h1>
    <p class="text-left text-darkShade">Interested in working together? You can reach me here. Or just say hi (I'm a person)!</p>
    <form class="mt-4" id="contactForm">
        <label class="mb-2 font-bold text-md text-darkShade" for="name">Info</label>
        <div class="flex sm:flex-row flex-col mb-4 ">
            <input class="border py-2 px-3 text-darkShade w-full" type="text" id="name" placeholder="Name" bind:value={name} />
            <input class="border py-2 px-3 text-darkShade w-full md:ml-4 sm:ml-0 mt-2 sm:mt-0" type="email" id="email" placeholder="Email" bind:value={email} />
        </div>
        <div class="flex flex-col mb-4">
            <label class="mb-2 font-bold text-md text-darkShade" for="company">Company and Role</label>
            <input class="border py-2 px-3 text-darkShade" type="text" id="company" bind:value={company} 
                placeholder="Tell me a little about yourself" />
        </div>
        <div class="flex flex-col mb-4">
            <label class="mb-2 font-bold text-md text-darkShade" for="message">Message</label>
            <textarea class="border py-2 px-3 text-darkShade" id="message" bind:value={message}
                placeholder="Any info you want to include here..."></textarea>
        </div>
        <div class="flex flex-col mb-4">
            <!--Div to show message feedback to users after submitting their info-->
            {#if showDangerMessage}
                <div class="flex flex-col mb-4">
                    <p class="text-left font-bold text-danger">{userMessage}</p>
                </div>
            {/if} 
            <!--show spinner when submit is disabled-->
            {#if disabled}
                <div class="ml-auto mr-auto mb-4">
                    <Spinner></Spinner>
                </div>
            {/if}
            <button on:click={submitContactForm} {disabled}
                class="bg-main hover:bg-darkAccent text-white font-bold py-2 px-4 rounded" type="submit">
                Submit
            </button>
        </div>
    </form>
</div>

<script lang="ts">
    import Spinner from "$lib/spinner.svelte";
	import { goto } from '$app/navigation';
    import { PUBLIC_CONTACT_API } from '$env/static/public';
    let name = '';
    let email = '';
    let company = '';
    let message = '';
    let userMessage: string;
    let showDangerMessage = false;
    let disabled = false;

    async function submitContactForm(e: Event) {
        // disable the submit button while we handle the event
        disabled = true;
        try {
            e.preventDefault();
            if (!validateForm()) {
                toggleUserMessage(true, 'Please fill out all fields and try again.')
                return;
            }
            // get api url from public env variable
            const url = PUBLIC_CONTACT_API;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    source: "Portfolio",
                    email,
                    company,
                    message
                })
            });
            if (response.status === 200) {
                goto(`/contact/success`, { replaceState: true });
                return;
            } else {
                toggleUserMessage(true, 'Something went wrong. Please try again.');
            }
        }
        catch (error) {
            console.error(error);
            toggleUserMessage(true, 'Something went wrong. Please try again.');
        }
        finally {
            disabled = false;
        }
    }

    // function to ensure all fields are filled out
    function validateForm() {
        // strip values and check if the user has entered anything
        if (name.trim() === '' || email.trim() === '' || company.trim() === '' || message.trim() === '') {
            return false;
        }
        return true;
    }

    function toggleUserMessage(show: boolean, message: string) {
        userMessage = message;
        showDangerMessage = show;
    }
</script>
