<script lang="ts">
  import { page } from '$app/stores';
  import favicon from '$lib/assets/favicon.png';
  import NavLink from './nav-link.svelte';

  export let hoverColor = 'text-main';

  $: path = $page.url.pathname;
  $: onPhotos = path.startsWith('/photos');
</script>

<nav class="nav" class:photos={onPhotos}>
  <a class="brand" href="/" aria-label="Home">
    <img class="brand-mark" src={favicon} alt="Aquaberry" />
  </a>
  <div class="nav-links">
    <NavLink link={'/blog'} iconCode={'book'} linkText={'Blog'} {hoverColor} active={path.startsWith('/blog')} />
    <NavLink link={'/photos'} iconCode={'photo_camera'} linkText={'Photos'} {hoverColor} active={onPhotos} />
    <NavLink link={'https://aquaberry.io/cto'} iconCode={'handshake'} linkText={'Work with me'} {hoverColor} />
  </div>
</nav>

<style lang="postcss">
  .nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.1rem clamp(1.5rem, 5vw, 5rem);
    background: linear-gradient(to bottom, theme(colors.paper), rgba(246, 239, 228, 0));
    pointer-events: none;
  }
  /* The photos page hangs on a warmer, gold-accented wall */
  .nav.photos {
    --nav-ink: #2d2b2b;
    --nav-accent: #a06f24;
    background: linear-gradient(to bottom, #f1e9db, rgba(241, 233, 219, 0));
  }
  .brand,
  .nav-links {
    pointer-events: auto;
  }
  .brand-mark {
    height: 34px;
    width: auto;
  }
  .nav-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
</style>
