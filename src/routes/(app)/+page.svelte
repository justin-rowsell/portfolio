<script lang="ts">
  import LandingSection from '../../lib/landing-section.svelte';
  import Seo from '$lib/seo.svelte';
  import { person, website } from '$lib/schema';
</script>

<Seo
  title="Justin Rowsell — Builder, explorer, systems thinker"
  description="Justin Rowsell builds software, explores the world, and studies how complex systems work — from AI and product to geography, GIS, climate, and fiber infrastructure. Founder of Aquaberry."
  path="/"
  schema={[website, person]}
/>

<LandingSection />
