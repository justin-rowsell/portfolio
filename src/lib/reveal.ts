/**
 * Svelte action: adds `is-visible` when the element scrolls into view.
 * Pair with the `.reveal` utility class for a fade-up on entry.
 * Optional `delay` (ms) staggers the reveal.
 */
export function reveal(node: HTMLElement, params: { delay?: number } = {}) {
  if (typeof IntersectionObserver === 'undefined') {
    node.classList.add('is-visible');
    return {};
  }

  if (params.delay) {
    node.style.transitionDelay = `${params.delay}ms`;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          observer.unobserve(node);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    }
  };
}
