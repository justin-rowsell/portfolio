<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let count = 0;
  let leaving = false;
  let gone = false;

  function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  onMount(() => {
    const duration = 1500;
    const start = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      count = Math.round(easeInOutCubic(t) * 100);
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        // Hold a beat at 100, then sweep away and reveal the scene
        dispatch('reveal');
        setTimeout(() => (leaving = true), 250);
        setTimeout(() => {
          gone = true;
          dispatch('complete');
        }, 250 + 900);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  });
</script>

{#if !gone}
  <div class="loader" class:leaving aria-hidden="true">
    <div class="inner">
      <p class="kicker">Justin Rowsell</p>
      <div class="count-row">
        <span class="count">{count}</span>
        <span class="pct">%</span>
      </div>
      <div class="bar">
        <div class="fill" style="transform: scaleX({count / 100})"></div>
      </div>
      <p class="hint">Builder · Explorer · Systems thinker</p>
    </div>
  </div>
{/if}

<style lang="postcss">
  .loader {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background: theme(colors.paper);
    transition: clip-path 0.9s cubic-bezier(0.76, 0, 0.24, 1),
      opacity 0.9s cubic-bezier(0.76, 0, 0.24, 1);
    clip-path: inset(0 0 0 0);
  }

  .loader.leaving {
    clip-path: inset(0 0 100% 0);
  }

  .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 2rem;
  }

  .kicker {
    font-family: theme(fontFamily.mono);
    font-size: 0.8rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: theme(colors.inkFaint);
    margin: 0 0 0.5rem;
  }

  .count-row {
    display: flex;
    align-items: baseline;
    color: theme(colors.ink);
  }

  .count {
    font-family: theme(fontFamily.display);
    font-weight: 400;
    font-size: clamp(4rem, 18vw, 9rem);
    line-height: 0.9;
    letter-spacing: -0.04em;
    font-variant-numeric: tabular-nums;
  }

  .pct {
    font-family: theme(fontFamily.display);
    font-size: clamp(1.5rem, 5vw, 2.5rem);
    color: theme(colors.main);
    margin-left: 0.25rem;
  }

  .bar {
    width: min(280px, 60vw);
    height: 2px;
    background: theme(colors.sandDeep);
    margin-top: 1.5rem;
    overflow: hidden;
  }

  .fill {
    height: 100%;
    width: 100%;
    transform-origin: left;
    background: theme(colors.main);
  }

  .hint {
    font-family: theme(fontFamily.mono);
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    color: theme(colors.inkFaint);
    margin-top: 1rem;
  }
</style>
