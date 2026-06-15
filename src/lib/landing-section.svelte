<script lang="ts">
  import headshot from '$lib/assets/headshot.jpeg';
  import { onMount, onDestroy } from 'svelte';
  import { Blossom } from './blossom';
  import { reveal } from './reveal';
  import Preloader from './preloader.svelte';

  let canvasEl: HTMLCanvasElement;
  let blossom: Blossom | undefined;
  let revealContent = false;

  onMount(() => {
    blossom = new Blossom(canvasEl);
  });

  onDestroy(() => {
    blossom?.dispose();
  });

  function handleReveal() {
    blossom?.start();
    revealContent = true;
  }

  const focusAreas = [
    {
      index: '01',
      name: 'Education',
      blurb: 'Tools that help people learn and retain what actually matters.'
    },
    {
      index: '02',
      name: 'Knowledge systems',
      blurb: 'Turning scattered, complex information into something navigable.'
    },
    {
      index: '03',
      name: 'AI-assisted tools',
      blurb: 'Practical AI that augments human judgment rather than replacing it.'
    }
  ];

  const themes = [
    {
      icon: 'hub',
      title: 'Systems Thinking',
      lede: 'The most interesting problems rarely fit into a single discipline.',
      body:
        "I'm particularly interested in how technology interacts with human behavior, incentives, institutions, and the physical world. This perspective influences how I approach product development, climate challenges, and the role AI should play in society."
    },
    {
      icon: 'eco',
      title: 'Climate',
      lede: 'Climate change is one of the defining challenges of our generation.',
      body:
        'I am especially interested in adaptation, biodiversity, clean energy, and the role software can play in helping people make better decisions in complex environmental systems.'
    },
    {
      icon: 'travel_explore',
      title: 'Travel & Culture',
      lede: 'Travel is one of the best ways to challenge assumptions and gain perspective.',
      body:
        'Living abroad, learning languages, and spending time in unfamiliar places has shaped how I think about people, culture, and problem solving. I believe language learning is part of that process — not simply a skill to acquire, but a way to better understand the communities and cultures around us.'
    }
  ];
</script>

<Preloader on:reveal={handleReveal} />

<main class="content" class:ready={revealContent}>
  <!-- HERO -->
  <section class="hero">
    <div class="hero-grid">
      <div class="hero-text">
        <p class="kicker">Founder · Builder · Systems thinker</p>
        <h1 class="hero-name">Justin<br />Rowsell</h1>
        <p class="hero-lede text-balance">
          I build software and study <em>complex systems</em>.
        </p>
        <p class="hero-sub text-balance">
          My interests span AI, climate, travel, and human behavior, but the common thread is
          understanding how things actually work beneath the surface. Whether exploring a new
          country, learning a language, researching climate adaptation, or building a product, I’m
          drawn to problems that require curiosity, first-principles thinking, and a willingness to
          challenge assumptions.
        </p>

        <div class="hero-meta">
          <img class="hero-photo" src={headshot} alt="Justin Rowsell" />
          <div class="hero-cta">
            <a class="btn btn-solid" href="https://aquaberry.io/cto">
              <span class="material-symbols-outlined">handshake</span> Work with me
            </a>
            <a class="btn btn-ghost" href="https://www.linkedin.com/in/justin-rowsell/" target="_blank" rel="noreferrer">
              <span class="material-symbols-outlined">arrow_outward</span> Connect
            </a>
          </div>
        </div>
      </div>

      <div class="hero-globe">
        <canvas bind:this={canvasEl} class="globe-canvas"></canvas>
      </div>
    </div>

    <div class="scroll-cue" aria-hidden="true">
      <span>Scroll</span>
      <span class="material-symbols-outlined">arrow_downward</span>
    </div>
  </section>

  <!-- BUILDING -->
  <section class="band">
    <div class="wrap">
      <p class="section-kicker reveal" use:reveal>01 — Building</p>
      <h2 class="section-title reveal text-balance" use:reveal={{ delay: 80 }}>
        I founded <a href="https://aquaberry.io" target="_blank" rel="noreferrer">Aquaberry</a>, a
        software studio focused on practical applications of AI.
      </h2>
      <p class="section-intro reveal text-balance" use:reveal={{ delay: 120 }}>
        We build products that help people learn, create, and navigate complex information. Current
        areas of focus:
      </p>

      <div class="projects">
        {#each focusAreas as p, i}
          <article class="project reveal" use:reveal={{ delay: i * 120 }}>
            <span class="project-index">{p.index}</span>
            <h3 class="project-name">{p.name}</h3>
            <p class="project-blurb">{p.blurb}</p>
          </article>
        {/each}
      </div>

      <div class="reveal band-btn" use:reveal={{ delay: 200 }}>
        <a class="btn btn-ghost" href="https://aquaberry.io" target="_blank" rel="noreferrer">
          <span class="material-symbols-outlined">arrow_outward</span> Explore Aquaberry
        </a>
      </div>
    </div>
  </section>

  <!-- AREAS OF INTEREST -->
  <section class="band band-alt">
    <div class="wrap">
      <p class="section-kicker reveal" use:reveal>02 — How I think</p>
      <h2 class="section-title reveal text-balance" use:reveal={{ delay: 80 }}>
        Understanding how things work beneath the surface.
      </h2>

      <ul class="interests">
        {#each themes as it, i}
          <li class="interest reveal" use:reveal={{ delay: i * 90 }}>
            <span class="interest-icon material-symbols-outlined">{it.icon}</span>
            <div class="interest-head">
              <h3 class="interest-title">{it.title}</h3>
              <p class="interest-lede">{it.lede}</p>
            </div>
            <p class="interest-text">{it.body}</p>
          </li>
        {/each}
      </ul>
    </div>
  </section>

  <!-- WORK WITH ME -->
  <section class="band band-cta">
    <div class="wrap center">
      <p class="section-kicker reveal" use:reveal>03 — Work with me</p>
      <h2 class="cta-title reveal text-balance" use:reveal={{ delay: 80 }}>
        I work with founders and small teams as a <em>Fractional CTO</em> — turning ideas into
        products and guiding technical execution from concept to launch.
      </h2>
      <div class="cta-row reveal" use:reveal={{ delay: 160 }}>
        <a class="btn btn-solid" href="https://aquaberry.io/cto">
          <span class="material-symbols-outlined">handshake</span> Start a conversation
        </a>
        <a class="btn btn-ghost" href="https://aquaberry.io" target="_blank" rel="noreferrer">
          <span class="material-symbols-outlined">arrow_outward</span> See Aquaberry
        </a>
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <div class="wrap footer-grid">
      <p class="footer-mark">Justin Rowsell</p>
      <nav class="footer-links">
        <a href="https://aquaberry.io" target="_blank" rel="noreferrer">Aquaberry</a>
        <a href="https://substack.com/@justinrowsell" target="_blank" rel="noreferrer">Blog</a>
        <a href="https://www.linkedin.com/in/justin-rowsell/" target="_blank" rel="noreferrer">LinkedIn</a>
      </nav>
      <p class="footer-fine">An Aquaberry Jam · Building software for tomorrow</p>
    </div>
  </footer>
</main>

<style lang="postcss">
  .content {
    opacity: 0;
    transition: opacity 1s ease 0.1s;
  }
  .content.ready {
    opacity: 1;
  }

  .kicker,
  .section-kicker,
  .project-index,
  .footer-fine,
  .scroll-cue {
    font-family: theme(fontFamily.mono);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: theme(colors.inkFaint);
    font-size: 0.72rem;
  }

  /* ---------- HERO ---------- */
  .hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 6rem clamp(1.5rem, 5vw, 5rem) 3rem;
  }
  .hero-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  @media (min-width: 900px) {
    .hero-grid {
      grid-template-columns: 1.05fr 0.95fr;
      gap: 3rem;
    }
  }
  .hero-name {
    font-family: theme(fontFamily.display);
    font-weight: 400;
    font-size: clamp(3.2rem, 11vw, 8rem);
    line-height: 0.92;
    letter-spacing: -0.04em;
    color: theme(colors.ink);
    margin: 1rem 0 1.5rem;
  }
  .hero-lede {
    font-family: theme(fontFamily.display);
    font-size: clamp(1.25rem, 2.6vw, 1.75rem);
    line-height: 1.35;
    color: theme(colors.ink);
    max-width: 34ch;
    margin: 0 0 1rem;
  }
  .hero-lede em {
    font-style: italic;
    color: theme(colors.darkAccent);
  }
  .hero-sub {
    font-size: 1rem;
    line-height: 1.65;
    color: theme(colors.inkSoft);
    max-width: 46ch;
    margin: 0 0 2rem;
  }
  .hero-meta {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex-wrap: wrap;
  }
  .hero-photo {
    width: 64px;
    height: 64px;
    border-radius: 9999px;
    object-fit: cover;
    border: 2px solid theme(colors.sandDeep);
    box-shadow: 0 6px 24px rgba(27, 23, 20, 0.12);
  }
  .hero-cta {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .hero-globe {
    position: relative;
    width: 100%;
    height: clamp(320px, 46vh, 520px);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .globe-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  .scroll-cue {
    display: none;
    color: theme(colors.inkFaint);
  }
  @media (min-width: 900px) {
    .scroll-cue {
      position: absolute;
      bottom: 1.75rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
    }
  }
  .scroll-cue .material-symbols-outlined {
    font-size: 1.1rem;
    animation: bob 1.8s ease-in-out infinite;
  }
  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(5px); }
  }

  /* ---------- BANDS ---------- */
  .band {
    padding: clamp(4rem, 10vw, 9rem) clamp(1.5rem, 5vw, 5rem);
  }
  .band-alt {
    background: theme(colors.sand);
    border-top: 1px solid theme(colors.sandDeep);
    border-bottom: 1px solid theme(colors.sandDeep);
  }
  .wrap {
    max-width: 1100px;
    margin: 0 auto;
  }
  .section-kicker {
    margin: 0 0 1.25rem;
  }
  .section-title {
    font-family: theme(fontFamily.display);
    font-weight: 400;
    font-size: clamp(1.8rem, 4.2vw, 3.25rem);
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: theme(colors.ink);
    margin: 0 0 3rem;
    max-width: 20ch;
  }
  .section-title a {
    color: theme(colors.darkAccent);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
  }

  /* ---------- PROJECTS ---------- */
  .projects {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1px;
    background: theme(colors.sandDeep);
    border: 1px solid theme(colors.sandDeep);
  }
  @media (min-width: 800px) {
    .projects { grid-template-columns: repeat(3, 1fr); }
  }
  .project {
    background: theme(colors.paper);
    padding: 2rem 1.75rem 2.5rem;
    transition: background 0.3s ease;
  }
  .project:hover {
    background: theme(colors.sand);
  }
  .project-index {
    display: block;
    margin-bottom: 1.5rem;
  }
  .project-name {
    font-family: theme(fontFamily.display);
    font-size: 1.65rem;
    color: theme(colors.ink);
    margin: 0 0 0.75rem;
  }
  .project-blurb {
    font-size: 0.95rem;
    line-height: 1.6;
    color: theme(colors.inkSoft);
    margin: 0;
  }

  /* ---------- INTERESTS ---------- */
  .interests {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .interest {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 1.25rem;
    row-gap: 0.75rem;
    padding: 2rem 0;
    border-top: 1px solid theme(colors.sandDeep);
    align-items: start;
  }
  .interest:last-child { border-bottom: 1px solid theme(colors.sandDeep); }
  @media (min-width: 820px) {
    .interest { grid-template-columns: auto 1fr 1.5fr; column-gap: 2.5rem; }
  }
  .interest-icon {
    font-size: 2rem;
    color: theme(colors.main);
    line-height: 1;
  }
  .interest-title {
    font-family: theme(fontFamily.display);
    font-size: 1.5rem;
    color: theme(colors.ink);
    margin: 0 0 0.4rem;
  }
  .interest-lede {
    font-family: theme(fontFamily.display);
    font-style: italic;
    font-size: 1.05rem;
    color: theme(colors.darkAccent);
    margin: 0;
  }
  .interest-text {
    grid-column: 2;
    font-size: 0.98rem;
    line-height: 1.65;
    color: theme(colors.inkSoft);
    margin: 0;
  }
  @media (min-width: 820px) {
    .interest-text { grid-column: 3; }
  }

  .section-intro {
    font-size: 1.05rem;
    line-height: 1.65;
    color: theme(colors.inkSoft);
    max-width: 56ch;
    margin: -1.75rem 0 2.5rem;
  }
  .band-btn {
    margin-top: 2.5rem;
  }

  /* ---------- CTA ---------- */
  .band-cta {
    background: theme(colors.ink);
  }
  .band-cta .section-kicker { color: rgba(246, 239, 228, 0.5); }
  .center { text-align: center; max-width: 900px; }
  .cta-title {
    font-family: theme(fontFamily.display);
    font-weight: 400;
    font-size: clamp(1.9rem, 4.5vw, 3.5rem);
    line-height: 1.12;
    letter-spacing: -0.03em;
    color: theme(colors.paper);
    margin: 1.25rem auto 2.5rem;
  }
  .cta-title em { font-style: italic; color: theme(colors.glow); }
  .cta-row {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .band-cta .btn-ghost {
    color: theme(colors.paper);
    border-color: rgba(246, 239, 228, 0.35);
  }
  .band-cta .btn-ghost:hover { border-color: theme(colors.paper); color: theme(colors.paper); }

  /* ---------- BUTTONS ---------- */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: theme(fontFamily.sans);
    font-weight: 500;
    font-size: 0.92rem;
    padding: 0.7rem 1.3rem;
    border-radius: 9999px;
    border: 1px solid transparent;
    transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }
  .btn .material-symbols-outlined { font-size: 1.1rem; }
  .btn:hover { transform: translateY(-2px); }
  .btn-solid {
    background: theme(colors.main);
    color: theme(colors.paper);
  }
  .btn-solid:hover { background: theme(colors.darkAccent); color: theme(colors.paper); }
  .btn-ghost {
    border-color: theme(colors.sandDeep);
    color: theme(colors.ink);
  }
  .btn-ghost:hover { border-color: theme(colors.ink); color: theme(colors.ink); }

  /* ---------- FOOTER ---------- */
  .site-footer {
    padding: 3rem clamp(1.5rem, 5vw, 5rem);
    border-top: 1px solid theme(colors.sandDeep);
  }
  .footer-grid {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }
  .footer-mark {
    font-family: theme(fontFamily.display);
    font-size: 1.25rem;
    color: theme(colors.ink);
    margin: 0;
  }
  .footer-links {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  .footer-links a {
    font-size: 0.9rem;
    color: theme(colors.inkSoft);
  }
  .footer-links a:hover { color: theme(colors.main); }
  .footer-fine { margin: 0; flex-basis: 100%; }
</style>
