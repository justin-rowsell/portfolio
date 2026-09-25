<footer class="site-footer">
	<div class="wrap footer-grid">
		<p class="footer-mark">Justin Rowsell</p>
		<nav class="footer-links">
			<a href="https://aquaberry.io" target="_blank" rel="noreferrer">Aquaberry</a>
			<a href="/blog">Blog</a>
			<a href="/photos">Photos</a>
			<a href="/rss.xml">RSS</a>
			<a href="https://www.linkedin.com/in/justin-rowsell/" target="_blank" rel="noreferrer"
				>LinkedIn</a
			>
		</nav>
		<p class="footer-fine">An Aquaberry Jam · Building software for tomorrow</p>
	</div>
</footer>

<style lang="postcss">
	.site-footer {
		padding: 3rem clamp(1.5rem, 5vw, 5rem);
		border-top: 1px solid theme(colors.sandDeep);
	}
	.wrap {
		max-width: 1100px;
		margin: 0 auto;
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
	.footer-links a:hover {
		color: theme(colors.main);
	}
	.footer-fine {
		margin: 0;
		flex-basis: 100%;
		font-family: theme(fontFamily.mono);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: theme(colors.inkFaint);
		font-size: 0.72rem;
	}
</style>
