<script lang="ts">
	import { BLOG_NAME, BUTTONDOWN_SUBSCRIBE_URL } from './config';

	/** Stay single-column, for use inside the post's reading column. */
	export let narrow = false;
</script>

<aside class="subscribe" class:narrow>
	<div class="copy">
		<p class="kicker">Get {BLOG_NAME} by email</p>
		<p class="lede">
			Occasional, short, and unpolished. Each new post lands in your inbox — nothing else.
		</p>
	</div>
	<form class="form" action={BUTTONDOWN_SUBSCRIBE_URL} method="post" target="_blank">
		<label class="sr-only" for="bd-email">Email address</label>
		<input
			id="bd-email"
			class="input"
			type="email"
			name="email"
			placeholder="you@example.com"
			required
		/>
		<input type="hidden" name="embed" value="1" />
		<button class="btn" type="submit">Subscribe</button>
	</form>
	<p class="alt">
		Prefer a reader? <a href="/rss.xml">RSS feed</a>
	</p>
</aside>

<style lang="postcss">
	.subscribe {
		display: grid;
		gap: 1.25rem;
		padding: clamp(1.5rem, 4vw, 2.25rem);
		background: theme(colors.sand);
		border: 1px solid theme(colors.sandDeep);
		border-radius: 1.25rem;
	}
	@media (min-width: 760px) {
		.subscribe:not(.narrow) {
			grid-template-columns: 1fr 1fr;
			align-items: center;
			column-gap: 2.5rem;
		}
		.subscribe:not(.narrow) .alt {
			grid-column: 1 / -1;
		}
	}
	.kicker {
		font-family: theme(fontFamily.mono);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: theme(colors.inkFaint);
		font-size: 0.72rem;
		margin: 0 0 0.5rem;
	}
	.lede {
		font-family: theme(fontFamily.display);
		font-size: 1.2rem;
		line-height: 1.4;
		color: theme(colors.ink);
		margin: 0;
	}
	.form {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.input {
		flex: 1 1 12rem;
		min-width: 0;
		font: inherit;
		font-size: 0.95rem;
		color: theme(colors.ink);
		background: theme(colors.paper);
		border: 1px solid theme(colors.sandDeep);
		border-radius: 9999px;
		padding: 0.7rem 1.1rem;
	}
	.input:focus {
		outline: 2px solid theme(colors.main);
		outline-offset: 1px;
	}
	.btn {
		font-weight: 500;
		font-size: 0.92rem;
		padding: 0.7rem 1.3rem;
		border-radius: 9999px;
		background: theme(colors.main);
		color: theme(colors.paper);
		transition: background 0.2s ease, transform 0.2s ease;
	}
	.btn:hover {
		background: theme(colors.darkAccent);
		transform: translateY(-2px);
	}
	.alt {
		margin: 0;
		font-size: 0.85rem;
		color: theme(colors.inkSoft);
	}
	.alt a {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}
</style>
