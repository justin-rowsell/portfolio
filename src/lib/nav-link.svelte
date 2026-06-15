<script lang="ts">
  export let link: string;
  export let iconCode: string;
  export let linkText: string;
  export let hoverColor = 'text-main';
</script>

<a href={link} class="nav-link {hoverColor}">
  <span class="material-symbols-outlined">{iconCode}</span>
  <span class="label">{linkText}</span>
</a>

<style lang="postcss">
  .nav-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: theme(fontFamily.mono);
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    color: theme(colors.ink);
  }
  .nav-link:hover { color: theme(colors.main); }
  .nav-link .material-symbols-outlined {
    font-size: 1.05rem;
  }
  .label {
    display: none;
  }
  @media (min-width: 640px) {
    .label { display: inline; }
  }
</style>
