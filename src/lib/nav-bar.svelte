<script lang="ts">
  import favicon from '$lib/assets/favicon.png';  
	import NavLink from './nav-link.svelte';

  export let hoverColor: string;
</script>

<nav class="flex items-center justify-between flex-wrap p-6 mb-5 bg-transparent">
    <div class="flex items-center mr-6">
      <a href="/">
        <img class="mr-3 h-9" src="{favicon}" alt="Aquaberry Icon"/>
      </a>
    </div>
    <!-- <div class="block sm:hidden">
      <button class="flex items-center px-3 py-2 border rounded text-main border-main hover:text-white hover:border-white">
        <svg class="fill-main h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
      </button>
    </div> -->
    <div class="flex flex-grow sm:items-center sm:justify-start items-end justify-end">
        <div class="text-sm md:flex-grow flex-col">
          <!-- <NavLink link={'/contact'} iconCode={'chat'} linkText={'Contact Me'} hoverColor={hoverColor}/> -->
          <!-- <NavLink link={'https://github.com/justin-rowsell'} iconCode={'code'} linkText={'Github'} hoverColor={hoverColor}/> -->
          <NavLink link={'https://substack.com/@justinrowsell'} iconCode={'book'} linkText={'Blog'} hoverColor={hoverColor} />
          <NavLink link={'/photography'} iconCode={'photo_library'} linkText={'Photo Gallery'} hoverColor={hoverColor} />
          <NavLink link={'/landscape-design'} iconCode={'landscape'} linkText={'Landscape Design'} hoverColor={hoverColor} />
        </div>
    </div>
    
</nav>