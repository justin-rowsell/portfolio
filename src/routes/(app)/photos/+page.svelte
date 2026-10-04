<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Seo from '$lib/seo.svelte';
	import SiteFooter from '$lib/site-footer.svelte';
	import { PHOTOS, formatTaken, photoSrc, photoSrcset, yearTaken } from '$lib/photography/photos';

	// Frames on the wall grow from this height to fill each row.
	const ROW_HEIGHT = 280;
	// Enough painted panels to cover the tallest wall (one column on a phone);
	// the extras are clipped.
	const FRESCO_PANELS = 24;
	const total = PHOTOS.length;
	const photos = PHOTOS.map((photo, i) => ({
		...photo,
		no: String(i + 1).padStart(2, '0'),
		aspect: photo.width / photo.height,
		date: formatTaken(photo.taken),
		year: yearTaken(photo.taken)
	}));

	// Vault phases: closed → unlock (wheel turns, bolts retract) → open (door swings) → enter (walk through) → done
	type Phase = 'closed' | 'unlock' | 'open' | 'enter' | 'done';
	const STEPS: [Phase, number][] = [
		['unlock', 500],
		['open', 1750],
		['enter', 2600],
		['done', 4100]
	];

	let phase: Phase = 'closed';
	let timers: ReturnType<typeof setTimeout>[] = [];
	let openIndex: number | null = null;
	let flipped = false;
	let vw = 0;
	let vh = 0;

	function clearTimers() {
		timers.forEach(clearTimeout);
		timers = [];
	}
	function play() {
		clearTimers();
		phase = 'closed';
		openIndex = null;
		flipped = false;
		timers = STEPS.map(([p, t]) => setTimeout(() => (phase = p), t));
	}
	function skip() {
		clearTimers();
		phase = 'done';
	}
	function open(i: number) {
		openIndex = i;
		flipped = false;
	}
	function close() {
		openIndex = null;
		flipped = false;
	}
	function flip() {
		flipped = !flipped;
	}
	function onKey(e: KeyboardEvent) {
		if (phase !== 'done' && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			return skip();
		}
		if (e.key === 'Escape' && openIndex !== null) close();
	}
	function activate(e: KeyboardEvent, action: () => void) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			e.stopPropagation();
			action();
		}
	}

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) skip();
		else play();
	});
	onDestroy(clearTimers);

	$: current = photos[openIndex ?? 0];

	// Card takes the photo's aspect: fit the photo inside the viewport, then add the card's chrome.
	$: maxW = Math.min(vw * 0.92, 1040);
	$: maxPhotoH = Math.max(260, vh - 220);
	$: photoW = Math.min(maxW - 44, maxPhotoH * current.aspect);
	$: cardW = Math.max(300, Math.round(photoW + 44));
	$: wide = cardW >= 480 && current.aspect >= 1.15 && !!current.note;

	$: unlocked = phase !== 'closed';
	$: opened = phase === 'open' || phase === 'enter' || phase === 'done';
	$: entering = phase === 'enter' || phase === 'done';
	const bolts = Array.from({ length: 12 }, (_, i) => i * 30);
	const spokes = [0, 60, 120];
</script>

<svelte:window on:keydown={onKey} bind:innerWidth={vw} bind:innerHeight={vh} />

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap"
	/>
	<!-- Without JavaScript the vault can't open, so skip straight to the wall. -->
	<noscript
		><style>
			.vault {
				display: none;
			}
			.gallery {
				transform: none !important;
				filter: none !important;
			}
		</style></noscript
	>
</svelte:head>

<Seo
	title="Pictures I’ve Taken — Justin Rowsell"
	description="Photographs I’ve taken, with a bit about each one."
	path="/photos"
/>

<div class="room">
	<!-- Gallery (scales in as you pass through the vault) -->
	<div
		class="gallery"
		style:transform={entering ? 'scale(1)' : 'scale(0.82)'}
		style:filter={entering ? 'brightness(1)' : 'brightness(0.55)'}
	>
		<main class="wall">
			<div class="wall-inner">
				<header class="intro">
					<h1>Pictures I’ve Taken</h1>
					<p class="lede">Click a photo to see a bit about it.</p>
				</header>

				<section aria-label="Photographs" class="works">
					<!-- The wall is painted like a palazzo ceiling: two Tiepolo ceiling studies
					     (The Met, open access) alternate down it, divided by gilt mouldings. -->
					<div class="fresco" aria-hidden="true">
						{#each Array(FRESCO_PANELS) as _, i}
							<div class="cornice" />
							<div class="fresco-panel" class:alt={i % 2 === 1} />
						{/each}
					</div>
					{#each photos as p, i (p.slug)}
						<figure
							class="work"
							style:flex="{Math.round(p.aspect * 100)} 1 {Math.round(p.aspect * ROW_HEIGHT)}px"
							role="button"
							tabindex="0"
							aria-label="Open {p.title}"
							on:click={() => open(i)}
							on:keydown={(e) => activate(e, () => open(i))}
						>
							<div class="lamp" aria-hidden="true" />
							<div class="frame">
								<div class="mat">
									<div class="print" style:aspect-ratio={p.aspect}>
										<img
											src={photoSrc(p, 1280)}
											srcset={photoSrcset(p)}
											sizes="(max-width: 640px) 100vw, 560px"
											width={p.width}
											height={p.height}
											alt={p.title}
											loading="lazy"
											decoding="async"
											style:object-position={p.position ?? '50% 50%'}
										/>
									</div>
								</div>
							</div>
							<figcaption>
								<span class="work-title">{p.title}</span>
								<span class="work-no">No. {p.no} / {total}</span>
								<span class="work-place">{p.location}, {p.year}</span>
							</figcaption>
						</figure>
					{/each}
					<div class="row-filler" aria-hidden="true" />
				</section>

				<div class="wall-foot">
					<button type="button" class="btn btn-gold" on:click={play}>Re-enter the vault</button>
				</div>
			</div>
		</main>

		<SiteFooter />
	</div>

	<!-- Card modal -->
	{#if openIndex !== null}
		<!-- Escape closes the card; handled on the window. -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="backdrop" on:click={close}>
			<div class="modal">
				<div
					class="card"
					style:width="{cardW}px"
					role="button"
					tabindex="0"
					aria-label="Turn the card over"
					on:click|stopPropagation={flip}
					on:keydown={(e) => activate(e, flip)}
				>
					<div class="card-inner" style:transform={flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}>
						<!-- FRONT (in flow: sets the card's height from the photo's aspect) -->
						<div class="face front">
							<div class="front-mat">
								<div class="card-head">
									<span class="card-kicker">Fotografie · Sala I</span>
									<span class="card-no">No. {current.no} / {total}</span>
								</div>
								<!-- The wall's copy is already loaded, so it stands in while the sharper one arrives -->
								<div
									class="card-print"
									style:aspect-ratio={current.aspect}
									style:--stand-in="url({photoSrc(current, 640)})"
								>
									<img
										src={photoSrc(current, 2048)}
										srcset={photoSrcset(current)}
										sizes="{cardW}px"
										width={current.width}
										height={current.height}
										alt={current.title}
										style:object-position={current.position ?? '50% 50%'}
									/>
								</div>
								<div class="card-caption">
									<span class="card-title">{current.title}</span>
									<span class="card-place">{current.location} — {current.date}</span>
								</div>
							</div>
						</div>

						<!-- BACK -->
						<div class="face back">
							<div class="label">
								<div class="label-head">
									<span class="label-kicker">Wall label</span>
									<span class="label-no">No. {current.no} / {total}</span>
								</div>
								<div
									class="label-body"
									style:grid-template-columns={wide
										? 'minmax(0, 1fr) minmax(0, 1.25fr)'
										: 'minmax(0, 1fr)'}
								>
									<div>
										<h2>{current.title}</h2>
										<dl>
											<dt>Location</dt>
											<dd>{current.location}</dd>
											<dt>Date</dt>
											<dd class="tabular">{current.date}</dd>
											<dt>Shot on</dt>
											<dd>{current.camera}</dd>
										</dl>
									</div>
									{#if current.note}
										<div class="note">
											<span class="note-kicker">A note from the artist</span>
											<p>{current.note}</p>
										</div>
									{/if}
								</div>
								<div class="label-foot">
									<span class="signature">Justin Rowsell</span>
									<span class="tabular">{current.location} · {current.year}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Keeps clicks between the buttons from closing the card. -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="card-actions" on:click={(e) => e.stopPropagation()}>
					<button type="button" class="btn btn-flip" on:click={flip}>
						{flipped ? 'Turn to front' : 'Turn over'}
					</button>
					<button type="button" class="btn btn-close" on:click={close}
						>Close &nbsp;·&nbsp; Esc</button
					>
				</div>
			</div>
		</div>
	{/if}

	<!-- Vault entrance -->
	{#if phase !== 'done'}
		<!-- Escape, Enter and Space skip the intro; handled on the window. -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="vault" on:click={skip}>
			<!-- Surround wall with the aperture; scales past the camera as you walk through -->
			<div
				class="surround"
				style:transform={entering ? 'scale(5.5)' : 'scale(1)'}
				style:opacity={entering ? 0 : 1}
			>
				<div class="surround-wall" />
				<div class="surround-ring" />
			</div>

			<!-- The door, hinged on the surround so it travels toward the camera with it -->
			<div
				class="door-mount"
				style:transform={entering ? 'scale(5.5)' : 'scale(1)'}
				style:opacity={entering ? 0 : 1}
			>
				<div class="door" style:transform={opened ? 'rotateY(-112deg)' : 'rotateY(0deg)'}>
					<div class="door-face" />

					{#each bolts as deg}
						<div
							class="bolt"
							style:transform="rotate({deg}deg) translateY({unlocked ? -27 : -31.5}vmin)"
						/>
					{/each}

					<div class="wheel" style:transform={unlocked ? 'rotate(270deg)' : 'rotate(0deg)'}>
						{#each spokes as deg}
							<div class="spoke" style:transform="rotate({deg}deg)">
								<div class="spoke-bar" />
								<div class="spoke-knob left" />
								<div class="spoke-knob right" />
							</div>
						{/each}
						<div class="hub" />
					</div>

					<div class="door-plate">Fotografie</div>
				</div>
			</div>

			<div class="vault-hint" style:opacity={phase === 'closed' || phase === 'unlock' ? 0.8 : 0}>
				Click to enter
			</div>
		</div>
	{/if}
</div>

<style>
	.room {
		--font-heading: 'Cormorant Garamond', Georgia, serif;
		--space-1: 4.6px;
		--space-2: 9.2px;
		--space-3: 13.8px;
		--space-4: 18.4px;
		--space-6: 27.6px;
		--radius-md: 4px;
		--gilt: linear-gradient(
			135deg,
			#facb8d 0%,
			#a06f24 22%,
			#ffe3bf 46%,
			#7d5411 72%,
			#e1ad66 100%
		);

		position: relative;
		min-height: 100vh;
		overflow-x: hidden;
		background: #f1e9db;
		color: #2d2b2b;
		font-family: 'Lora', Georgia, serif;
	}
	.room ::selection {
		background: color-mix(in srgb, #e1ad66 40%, transparent);
	}

	/* The design's warm grade, drawn over the untouched files */
	.print img,
	.card-print img,
	.card-print::before {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: sepia(0.14) saturate(0.92) contrast(1.05);
	}

	/* ── Gallery ─────────────────────────────────────────────── */
	.gallery {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		transform-origin: 50% 30vh;
		transition: transform 1.5s cubic-bezier(0.22, 1, 0.36, 1), filter 1.5s ease;
	}
	.wall {
		flex: 1;
		padding: clamp(7rem, 14vw, 10rem) clamp(1.5rem, 5vw, 5rem) clamp(4rem, 8vw, 6rem);
		background: radial-gradient(120% 55% at 50% 0%, #fbf5ea 0%, #f1e9db 55%, #e8dcc6 100%);
	}
	.wall-inner {
		max-width: 1180px;
		margin: 0 auto;
	}

	.intro {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: clamp(1.5rem, 4vw, 3rem);
		align-items: end;
		padding-bottom: var(--space-6);
		border-bottom: 1px solid #a06f24;
		box-shadow: 0 4px 0 -3px #e1ad66;
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(3rem, 7.5vw, 6rem);
		line-height: 0.96;
		letter-spacing: -0.02em;
		color: #2d2b2b;
	}
	.lede {
		max-width: 42ch;
		margin: 0;
		font-size: 15px;
		line-height: 1.7;
		color: #444141;
	}

	.works {
		position: relative;
		isolation: isolate;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: clamp(2.75rem, 5vw, 4.5rem) clamp(1.5rem, 3vw, 2.5rem);
		padding: clamp(3rem, 6vw, 5rem) 0;
	}
	.fresco {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 100vw;
		transform: translateX(-50%);
		z-index: -1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	/* A light plaster wash so the frames, not the painting, lead */
	.fresco::after {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(241, 233, 219, 0.08);
		box-shadow: inset 0 -40px 40px -20px rgba(232, 220, 198, 0.9);
	}
	.fresco-panel {
		flex: none;
		/* On narrow screens, crop the painting rather than shrink its figures */
		width: max(100%, 800px);
		align-self: center;
		aspect-ratio: 2000 / 2652;
		background: url('/images/fresco-planets.webp') center / cover;
	}
	.fresco-panel.alt {
		aspect-ratio: 2000 / 2819;
		background-image: url('/images/fresco-giustiniani.webp');
	}
	.cornice {
		flex: none;
		position: relative;
		z-index: 1;
		height: 16px;
		background: linear-gradient(
			180deg,
			#3a270d,
			#e1ad66 18%,
			#ffe3bf 32%,
			#a06f24 55%,
			#7d5411 78%,
			#3a270d
		);
		box-shadow: 0 4px 10px rgba(35, 22, 5, 0.45);
	}
	.work {
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		cursor: pointer;
		min-width: min(100%, 210px);
	}
	.row-filler {
		flex: 9999 1 0;
		min-width: 0;
	}
	.lamp {
		width: 34%;
		max-width: 120px;
		height: 7px;
		border-radius: 4px;
		background: linear-gradient(180deg, #ffe3bf, #a06f24 60%, #5a3b0a);
		box-shadow: 0 14px 30px 10px rgba(225, 173, 102, 0.28);
	}
	.frame {
		width: 100%;
		padding: 9px;
		background: var(--gilt);
		box-shadow: inset 0 0 0 1px #5a3b0a, inset 0 0 0 3px rgba(255, 243, 228, 0.35),
			0 0 0 1px #5a3b0a, 0 18px 40px rgba(58, 39, 13, 0.28);
		transition: box-shadow 0.3s ease;
	}
	.work:hover .frame {
		box-shadow: inset 0 0 0 1px #5a3b0a, inset 0 0 0 3px rgba(255, 243, 228, 0.5), 0 0 0 1px #5a3b0a,
			0 24px 52px rgba(58, 39, 13, 0.36);
	}
	.mat {
		padding: clamp(10px, 1.3vw, 16px);
		background: #f6ecd9;
		box-shadow: inset 0 0 0 1px #c28d41, inset 0 2px 8px rgba(58, 39, 13, 0.35);
	}
	.print {
		position: relative;
		width: 100%;
		background: #eae0cc;
		box-shadow: 0 0 0 1px rgba(90, 59, 10, 0.35);
	}
	figcaption {
		align-self: stretch;
		display: grid;
		grid-template-columns: 1fr auto;
		gap: var(--space-1) var(--space-3);
		align-items: baseline;
		/* A cream wall label, so captions read over the painting */
		padding: 8px 10px;
		background: rgba(246, 236, 217, 0.94);
		border: 1px solid rgba(194, 141, 65, 0.55);
		box-shadow: 0 3px 10px rgba(35, 22, 5, 0.3);
	}
	.work-title {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 20px;
		line-height: 1.15;
		color: #2d2b2b;
	}
	.work-no,
	.card-no,
	.label-no {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 12px;
		letter-spacing: 0.08em;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.work-no,
	.card-no {
		color: #7d5411;
	}
	.work-place {
		grid-column: 1 / -1;
		font-size: 12px;
		font-style: italic;
		color: #605d5d;
	}

	.wall-foot {
		margin-top: clamp(3.5rem, 7vw, 5.5rem);
		padding-top: var(--space-4);
		border-top: 1px solid #a06f24;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		align-items: center;
		gap: var(--space-3);
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		cursor: pointer;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 14px;
		line-height: 1.2;
		background: transparent;
		padding: var(--space-2) calc(var(--space-3) * 1.2);
		border-radius: var(--radius-md);
	}
	.btn-gold {
		color: #7d5411;
		border: 1px solid #a06f24;
	}
	.btn-gold:hover {
		background: rgba(182, 130, 53, 0.12);
		border-color: #7d5411;
	}

	/* ── Card modal ──────────────────────────────────────────── */
	@keyframes backdrop-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes card-in {
		from {
			opacity: 0;
			transform: translateY(18px) scale(0.97);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: grid;
		place-items: center;
		padding: var(--space-4);
		overflow-y: auto;
		background: rgba(45, 43, 43, 0.72);
		animation: backdrop-in 0.25s ease;
	}
	.modal {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		animation: card-in 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.card {
		perspective: 1600px;
		cursor: pointer;
	}
	.card-inner {
		position: relative;
		width: 100%;
		transform-style: preserve-3d;
		transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.face {
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		padding: 8px;
		border-radius: 8px;
		background: var(--gilt);
	}
	.front {
		position: relative;
		box-shadow: inset 0 0 0 1px #5a3b0a, 0 30px 80px rgba(0, 0, 0, 0.6),
			0 0 60px rgba(250, 203, 141, 0.18);
	}
	.front-mat {
		display: flex;
		flex-direction: column;
		padding: 14px;
		border-radius: 4px;
		background: #f6ecd9;
		box-shadow: inset 0 0 0 1px #c28d41;
	}
	.card-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 0 2px 10px;
	}
	.card-kicker {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 11px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #7d5411;
	}
	.card-print {
		position: relative;
		width: 100%;
		background: #eae0cc;
		box-shadow: 0 0 0 1px #c28d41, 0 0 0 5px #f6ecd9, 0 0 0 6px rgba(125, 84, 17, 0.4);
	}
	.card-print::before {
		content: '';
		background: var(--stand-in) center / cover;
	}
	.card-caption {
		padding: 14px 2px 0;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		flex-wrap: wrap;
	}
	.card-title {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 24px;
		line-height: 1.1;
		color: #201f1d;
	}
	.card-place {
		font-size: 12px;
		font-style: italic;
		color: #5a3b0a;
	}

	.back {
		position: absolute;
		inset: 0;
		transform: rotateY(180deg);
		box-shadow: inset 0 0 0 1px #5a3b0a, 0 30px 80px rgba(0, 0, 0, 0.6);
	}
	.label {
		height: 100%;
		display: flex;
		flex-direction: column;
		padding: clamp(16px, 3vw, 28px);
		border-radius: 4px;
		background: radial-gradient(120% 80% at 50% 0%, #5c1a1b, #34100f 60%, #230809);
		box-shadow: inset 0 0 0 1px #c28d41, inset 0 0 0 5px #34100f,
			inset 0 0 0 6px rgba(225, 173, 102, 0.5);
		overflow: auto;
	}
	.label-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding-bottom: 12px;
		border-bottom: 1px solid rgba(225, 173, 102, 0.45);
	}
	.label-kicker,
	.note-kicker,
	dt {
		font-family: var(--font-heading);
		font-weight: 600;
		text-transform: uppercase;
		color: #e1ad66;
	}
	.label-kicker {
		font-size: 11px;
		letter-spacing: 0.2em;
	}
	.label-no {
		color: #e1ad66;
	}
	.label-body {
		flex: 1;
		min-height: 0;
		overflow: auto;
		display: grid;
		gap: 18px clamp(20px, 3vw, 36px);
		padding-top: 16px;
		align-content: start;
	}
	h2 {
		margin: 0 0 14px;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(26px, 3vw, 34px);
		line-height: 1.05;
		letter-spacing: -0.01em;
		color: #fff3e4;
	}
	dl {
		margin: 0;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 8px 16px;
		font-size: 13px;
	}
	dt {
		font-size: 11px;
		letter-spacing: 0.14em;
		padding-top: 2px;
	}
	dd {
		margin: 0;
		color: #f6ecd9;
	}
	.tabular {
		font-variant-numeric: tabular-nums;
	}
	.note {
		padding-top: 14px;
		border-top: 1px solid rgba(225, 173, 102, 0.45);
	}
	.note-kicker {
		font-size: 11px;
		letter-spacing: 0.14em;
	}
	.note p {
		margin: 10px 0 0;
		font-size: 14px;
		line-height: 1.65;
		font-style: italic;
		text-align: justify;
		hyphens: auto;
		color: #f6ecd9;
	}
	.label-foot {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding-top: 12px;
		margin-top: 12px;
		border-top: 1px solid rgba(225, 173, 102, 0.45);
		font-size: 11px;
		color: #e8d3b0;
	}
	.signature {
		font-family: var(--font-heading);
		font-size: 17px;
		font-style: italic;
		color: #facb8d;
	}

	.card-actions {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}
	.btn-flip {
		color: #facb8d;
		border: 1px solid #c28d41;
	}
	.btn-flip:hover {
		background: rgba(250, 203, 141, 0.12);
		border-color: #facb8d;
	}
	.btn-close {
		color: #f6ecd9;
		border: 1px solid rgba(246, 236, 217, 0.3);
	}
	.btn-close:hover {
		background: rgba(246, 236, 217, 0.08);
	}

	/* ── Vault entrance ──────────────────────────────────────── */
	.vault {
		position: fixed;
		inset: 0;
		z-index: 200;
		perspective: 1800px;
		cursor: pointer;
		overflow: hidden;
	}
	@media (prefers-reduced-motion: reduce) {
		.vault {
			display: none;
		}
	}
	.surround {
		position: absolute;
		inset: -50vmax;
		display: grid;
		place-items: center;
		transition: transform 1.5s cubic-bezier(0.7, 0, 0.3, 1), opacity 1.1s ease 0.35s;
	}
	.surround-wall {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 50% 50%, #3a0d0e 0, #1a0506 70vmin);
		-webkit-mask: radial-gradient(circle at 50% 50%, transparent 0 37vmin, #000 calc(37vmin + 1px));
		mask: radial-gradient(circle at 50% 50%, transparent 0 37vmin, #000 calc(37vmin + 1px));
	}
	.surround-ring {
		position: relative;
		width: 80vmin;
		height: 80vmin;
		border-radius: 50%;
		box-shadow: 0 0 0 1px #3a270d, inset 0 0 0 1px #5a3b0a, inset 0 0 0 1.6vmin #a06f24,
			inset 0 0 0 1.9vmin #ffe3bf, inset 0 0 0 2.6vmin #7d5411, inset 0 0 0 3vmin #3a270d,
			0 0 90px rgba(250, 203, 141, 0.18);
	}
	.door-mount {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 74vmin;
		height: 74vmin;
		margin: -37vmin 0 0 -37vmin;
		transform-origin: 50% 50%;
		transition: transform 1.5s cubic-bezier(0.7, 0, 0.3, 1), opacity 1.1s ease 0.35s;
		transform-style: preserve-3d;
	}
	.door {
		position: absolute;
		inset: 0;
		transform-origin: 0% 50%;
		transition: transform 1.4s cubic-bezier(0.55, 0, 0.25, 1);
		transform-style: preserve-3d;
	}
	.door-face {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: radial-gradient(
			circle at 62% 35%,
			#7d5411 0%,
			#5a3b0a 30%,
			#3a270d 70%,
			#231605 100%
		);
		box-shadow: inset 0 0 0 0.6vmin #e1ad66, inset 0 0 0 1.2vmin #5a3b0a,
			inset 0 0 0 1.5vmin #c28d41, inset 0 0 0 6vmin #3a270d, inset 0 0 0 6.3vmin #a06f24,
			inset 0 0 0 6.6vmin #3a270d, inset 0 0 0 11vmin rgba(58, 39, 13, 0.4),
			inset 0 0 0 11.25vmin #7d5411, -18px 22px 50px rgba(0, 0, 0, 0.6);
	}
	.bolt {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 3vmin;
		height: 3vmin;
		margin: -1.5vmin 0 0 -1.5vmin;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 30%, #ffe3bf, #c28d41 45%, #5a3b0a);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
		transition: transform 0.9s cubic-bezier(0.65, 0, 0.35, 1) 0.1s;
	}
	.wheel {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 52vmin;
		height: 52vmin;
		margin: -26vmin 0 0 -26vmin;
		transition: transform 1.2s cubic-bezier(0.65, 0, 0.35, 1);
	}
	.spoke {
		position: absolute;
		left: 0;
		top: 50%;
		width: 100%;
		height: 2vmin;
		margin-top: -1vmin;
	}
	.spoke-bar {
		position: absolute;
		left: 3vmin;
		right: 3vmin;
		top: 0;
		bottom: 0;
		border-radius: 1vmin;
		background: linear-gradient(180deg, #ffe3bf, #c28d41 45%, #7d5411);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
	}
	.spoke-knob {
		position: absolute;
		top: 50%;
		width: 5vmin;
		height: 5vmin;
		margin-top: -2.5vmin;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 30%, #fff3e4, #e1ad66 40%, #7d5411);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
	}
	.spoke-knob.left {
		left: 0;
	}
	.spoke-knob.right {
		right: 0;
	}
	.hub {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 15vmin;
		height: 15vmin;
		margin: -7.5vmin 0 0 -7.5vmin;
		border-radius: 50%;
		background: radial-gradient(circle at 38% 32%, #fff3e4, #e1ad66 30%, #a06f24 60%, #5a3b0a);
		box-shadow: inset 0 0 0 0.5vmin #7d5411, inset 0 0 0 0.8vmin #facb8d,
			0 4px 14px rgba(0, 0, 0, 0.55);
	}
	.door-plate {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 15vmin;
		text-align: center;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 2.1vmin;
		letter-spacing: 0.5em;
		text-transform: uppercase;
		color: #e1ad66;
		opacity: 0.85;
	}
	.vault-hint {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 3vh;
		text-align: center;
		font-family: var(--font-heading);
		font-size: 13px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #e1ad66;
		transition: opacity 0.4s ease;
	}
</style>
