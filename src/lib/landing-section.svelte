<script lang="ts">
  import headshot from '$lib/assets/headshot.jpeg';
  import { onMount, onDestroy } from 'svelte';
  import { Globe, PLACES } from './globe';
  import { reveal } from './reveal';
  import Preloader from './preloader.svelte';

  let canvasEl: HTMLCanvasElement;
  let globe: Globe | undefined;
  let revealContent = false;

  onMount(() => {
    globe = new Globe(canvasEl);
  });

  onDestroy(() => {
    globe?.dispose();
  });

  function handleReveal() {
    globe?.start();
    revealContent = true;
  }

  // Faint topographic contour lines used as a backdrop. Each entry is a vertical
  // offset; the same gentle wave is repeated to read like a survey / topo map.
  const contourPath =
    'M0,0 C100,-16 200,16 300,0 C400,-16 500,16 600,0 C700,-16 800,16 900,0 C1000,-16 1100,16 1200,0';
  const contours = Array.from({ length: 18 }, (_, i) => i * 38);

  // 01 — BUILD: software, AI, product (Aquaberry)
  const buildItems = [
    {
      index: '01',
      name: 'Learning tools',
      blurb: 'Software that helps people learn and retain what actually matters.'
    },
    {
      index: '02',
      name: 'Knowledge systems',
      blurb: 'Turning scattered, complex information into something navigable.'
    },
    {
      index: '03',
      name: 'Applied AI',
      blurb: 'Practical AI that augments human judgment rather than replacing it.'
    }
  ];

  // 02 — UNDERSTAND: systems thinking, geography/GIS, climate, infrastructure
  const understandItems = [
    {
      icon: 'hub',
      title: 'Systems thinking',
      lede: 'The most interesting problems rarely fit into a single discipline.',
      body:
        'I’m drawn to how technology interacts with human behavior, incentives, institutions, and the physical world. It’s the lens behind everything else here — and the reason I keep one foot outside of software.'
    },
    {
      icon: 'public',
      title: 'Geography & GIS',
      lede: 'Years spent with maps, geospatial data, and the shape of the land.',
      body:
        'GIS, cartography, fiber network design, biodiversity and climate work — geography is the recurring thread across my career and my curiosity. I think in places, routes, and terrain as much as in code.'
    },
    {
      icon: 'eco',
      title: 'Climate',
      lede: 'One of the defining challenges of our generation.',
      body:
        'I’m especially interested in adaptation, biodiversity, and clean energy — and the role software can play in helping people make better decisions inside complex environmental systems.'
    },
    {
      icon: 'lan',
      title: 'Infrastructure',
      lede: 'Three years designing fiber networks — how the digital world is physically built.',
      body:
        'Conduit, last-mile routing, real terrain and real constraints. Building telecom infrastructure grounded me in systems you can’t refactor away, and it shapes how I build digital products today.'
    }
  ];

  // 03 — EXPLORE: travel, language, outdoors
  const exploreItems = [
    {
      icon: 'travel_explore',
      title: 'Travel & culture',
      lede: 'Travel is one of the best ways to challenge assumptions.',
      body:
        'Living abroad and spending time in unfamiliar places has shaped how I think about people, culture, and problem solving. I’d rather see a system working in the world than read about it.'
    },
    {
      icon: 'translate',
      title: 'Language',
      lede: 'Learning a language is learning a worldview.',
      body:
        'Not just a skill to acquire, but a way to better understand the communities and cultures around me — and another complex system worth getting lost in.'
    },
    {
      icon: 'landscape',
      title: 'Outdoors',
      lede: 'Hiking, camping, fishing — time spent in the field.',
      body:
        'Firsthand experience over abstract theory. The outdoors is where I think most clearly, and where the systems I care about stop being diagrams.'
    }
  ];
</script>

<Preloader on:reveal={handleReveal} />

<main class="content" class:ready={revealContent}>
  <!-- HERO -->
  <section class="hero">
    <svg
      class="contour"
      viewBox="0 0 1200 660"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {#each contours as y}
        <path d={contourPath} transform="translate(0,{y})" />
      {/each}
    </svg>

    <div class="hero-grid">
      <div class="hero-text">
        <p class="kicker">Builder · Explorer · Systems thinker</p>
        <h1 class="hero-name">Justin<br />Rowsell</h1>
        <p class="hero-lede text-balance">
          I build software, explore the world, and study how <em>complex systems</em> work.
        </p>
        <p class="hero-sub text-balance">
          Across software, AI, GIS, climate, and fiber infrastructure, the thread is the same:
          understanding how complex systems work beneath the surface. I learn through firsthand
          experience — living abroad, learning languages, and spending time outdoors — because the
          most interesting systems rarely exist in isolation, and rarely fit neatly on a screen.
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
        <div class="globe-legend">
          <p class="legend-cap">Lived &amp; worked</p>
          <ul>
            {#each PLACES as place}
              <li class="legend-item">
                <span class="legend-dot" aria-hidden="true"></span>
                <span class="legend-name">{place.label}</span>
                <span class="legend-coord">{place.coords}</span>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>

    <div class="scroll-cue" aria-hidden="true">
      <svg class="compass" viewBox="0 0 100 100">
        <circle class="compass-ring" cx="50" cy="50" r="46" />
        <line class="compass-tick" x1="50" y1="6" x2="50" y2="16" />
        <line class="compass-tick" x1="50" y1="84" x2="50" y2="94" />
        <line class="compass-tick" x1="6" y1="50" x2="16" y2="50" />
        <line class="compass-tick" x1="84" y1="50" x2="94" y2="50" />
        <polygon class="compass-n" points="50,14 57,50 50,50" />
        <polygon class="compass-n-shade" points="50,14 43,50 50,50" />
        <polygon class="compass-s" points="50,86 57,50 50,50" />
        <polygon class="compass-s" points="50,86 43,50 50,50" />
      </svg>
      <span>Scroll to explore</span>
    </div>
  </section>

  <!-- 01 — BUILD -->
  <section class="band">
    <div class="wrap">
      <p class="section-kicker reveal" use:reveal>01 · Build</p>
      <h2 class="section-title reveal text-balance" use:reveal={{ delay: 80 }}>
        I founded <a href="https://aquaberry.io" target="_blank" rel="noreferrer">Aquaberry</a>, a
        software studio for practical, applied AI.
      </h2>
      <p class="section-intro reveal text-balance" use:reveal={{ delay: 120 }}>
        I build products that help people learn, create, and navigate complex information — grounded
        in years of shipping real-world systems, from web platforms to fiber network design. Current
        areas of focus:
      </p>

      <div class="projects">
        {#each buildItems as p, i}
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

  <!-- 02 — UNDERSTAND -->
  <section class="band band-alt">
    <div class="topo-divider" aria-hidden="true">
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
        <path d="M0,30 C100,14 200,46 300,30 C400,14 500,46 600,30 C700,14 800,46 900,30 C1000,14 1100,46 1200,30" />
        <path d="M0,44 C100,28 200,60 300,44 C400,28 500,60 600,44 C700,28 800,60 900,44 C1000,28 1100,60 1200,44" />
      </svg>
    </div>
    <div class="wrap">
      <p class="section-kicker reveal" use:reveal>02 · Understand</p>
      <h2 class="section-title reveal text-balance" use:reveal={{ delay: 80 }}>
        Understanding how complex systems work beneath the surface.
      </h2>

      <ul class="interests">
        {#each understandItems as it, i}
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

  <!-- 03 — EXPLORE -->
  <section class="band">
    <div class="wrap">
      <p class="section-kicker reveal" use:reveal>03 · Explore</p>
      <h2 class="section-title reveal text-balance" use:reveal={{ delay: 80 }}>
        I learn firsthand — by going there.
      </h2>

      <ul class="interests">
        {#each exploreItems as it, i}
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

  <!-- WORK WITH ME (understated) -->
  <section class="band band-cta">
    <div class="wrap center">
      <p class="section-kicker reveal" use:reveal>Work with me</p>
      <h2 class="cta-title reveal text-balance" use:reveal={{ delay: 80 }}>
        I work with founders and small teams as a <em>fractional CTO</em>, turning ideas into
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
  .scroll-cue,
  .legend-cap,
  .legend-coord {
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
    overflow: hidden;
  }
  .contour {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    color: theme(colors.sandDeep);
    opacity: 0.5;
    z-index: 0;
    pointer-events: none;
  }
  .contour path {
    fill: none;
    stroke: currentColor;
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }
  .hero-grid {
    position: relative;
    z-index: 1;
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
    max-width: 50ch;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .globe-canvas {
    width: 100%;
    height: clamp(300px, 42vh, 480px);
    display: block;
  }

  /* ---------- GLOBE LEGEND ---------- */
  .globe-legend {
    width: 100%;
    max-width: 320px;
  }
  .legend-cap {
    margin: 0 0 0.75rem;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid theme(colors.sandDeep);
  }
  .globe-legend ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .legend-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0.6rem;
  }
  .legend-dot {
    width: 7px;
    height: 7px;
    border-radius: 9999px;
    background: theme(colors.main);
    box-shadow: 0 0 0 3px rgba(220, 0, 0, 0.14);
  }
  .legend-name {
    font-family: theme(fontFamily.sans);
    font-size: 0.92rem;
    color: theme(colors.ink);
  }
  .legend-coord {
    font-size: 0.66rem;
    color: theme(colors.inkFaint);
  }

  /* ---------- SCROLL CUE / COMPASS ---------- */
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
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
  }
  .compass {
    width: 30px;
    height: 30px;
    animation: bob 2.4s ease-in-out infinite;
  }
  .compass-ring {
    fill: none;
    stroke: theme(colors.inkFaint);
    stroke-width: 2;
  }
  .compass-tick {
    stroke: theme(colors.inkFaint);
    stroke-width: 2;
  }
  .compass-n {
    fill: theme(colors.main);
  }
  .compass-n-shade {
    fill: theme(colors.darkAccent);
  }
  .compass-s {
    fill: theme(colors.sandDeep);
  }
  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(5px); }
  }

  /* ---------- BANDS ---------- */
  .band {
    position: relative;
    padding: clamp(4rem, 10vw, 9rem) clamp(1.5rem, 5vw, 5rem);
  }
  .band-alt {
    background: theme(colors.sand);
    border-top: 1px solid theme(colors.sandDeep);
    border-bottom: 1px solid theme(colors.sandDeep);
  }
  .topo-divider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    color: theme(colors.sandDeep);
    opacity: 0.7;
    pointer-events: none;
  }
  .topo-divider svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  .topo-divider path {
    fill: none;
    stroke: currentColor;
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
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
    max-width: 60ch;
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
    font-size: clamp(1.7rem, 4vw, 3rem);
    line-height: 1.14;
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

  @media (prefers-reduced-motion: reduce) {
    .compass { animation: none; }
  }
</style>
