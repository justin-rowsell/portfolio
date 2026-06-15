<script lang="ts">
  import favicon from '$lib/assets/favicon.png';
  import NavLink from './nav-link.svelte';

  export let hoverColor = 'text-main';
</script>

<nav class="nav">
  <a class="brand" href="/" aria-label="Home">
    <img class="brand-mark" src={favicon} alt="Aquaberry" />
  </a>
  <div class="nav-links">
    <NavLink link={'https://substack.com/@justinrowsell'} iconCode={'book'} linkText={'Blog'} {hoverColor} />
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
