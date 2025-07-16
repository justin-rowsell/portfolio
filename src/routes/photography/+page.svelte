<script lang="ts">
  import { photoStore } from '$lib/photo-store';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
  import type { Photo } from '$lib/models/photos/photo';

  let photos: Photo[] = [];
  let modalOpen = false;
  let selectedPhoto: Photo | null = null;

  onMount(() => {
    photos = get(photoStore);
  });

  function openModal(photo: Photo) {
    selectedPhoto = photo;
    modalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOpen = false;
    selectedPhoto = null;
    document.body.style.overflow = '';
  }
</script>

<section class="min-h-screen w-full bg-black flex flex-col items-center py-12">
  <div class="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
    {#each photos as photo}
      <button class="group bg-transparent p-2 border-none outline-none focus:outline-none aspect-square w-full overflow-hidden rounded-xl" on:click={() => openModal(photo)}>
        <span class="block w-full h-full">
          <img
            src={photo.image}
            alt={photo.description}
            class="w-full h-full object-cover shadow-lg transition-transform duration-200 group-hover:scale-105 group-focus:scale-105"
          />
        </span>
      </button>
    {/each}
  </div>

  {#if modalOpen && selectedPhoto}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" on:click={closeModal}>
      <div class="bg-zinc-900 rounded-xl shadow-2xl flex flex-col md:flex-row max-w-3xl w-full mx-4 overflow-hidden" on:click|stopPropagation>
        <img
          src={selectedPhoto.image}
          alt={selectedPhoto.description}
          class="h-[400px] w-auto max-w-full object-contain bg-zinc-800 md:rounded-l-xl md:rounded-r-none rounded-t-xl md:rounded-t-none"
        />
        <div class="flex flex-col justify-center p-8 w-full md:w-96">
          <p class="text-2xl font-bold text-gray-100 mb-4">{selectedPhoto.description}</p>
          <p class="text-lg text-gray-400 mb-2">{selectedPhoto.location}</p>
          <button class="mt-8 self-end px-4 py-2 bg-zinc-800 text-gray-200 rounded hover:bg-zinc-700 transition" on:click={closeModal}>Close</button>
        </div>
      </div>
    </div>
  {/if}
</section> 