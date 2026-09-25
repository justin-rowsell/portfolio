<script lang="ts">
	import type { Tag } from './types';

	export let tags: (Tag & { count?: number })[];
	export let active: string | undefined = undefined;
</script>

{#if tags.length}
	<ul class="tags">
		{#each tags as tag}
			<li>
				<a
					class="tag"
					class:active={tag.slug === active}
					href="/blog/tags/{tag.slug}"
					aria-current={tag.slug === active ? 'page' : undefined}
				>
					{tag.name}{#if tag.count !== undefined}<span class="count">{tag.count}</span>{/if}
				</a>
			</li>
		{/each}
	</ul>
{/if}

<style lang="postcss">
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.tag {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-family: theme(fontFamily.mono);
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: theme(colors.inkSoft);
		border: 1px solid theme(colors.sandDeep);
		border-radius: 9999px;
		padding: 0.28rem 0.7rem;
		transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
	}
	.tag:hover {
		border-color: theme(colors.main);
		color: theme(colors.main);
	}
	.tag.active {
		background: theme(colors.ink);
		border-color: theme(colors.ink);
		color: theme(colors.paper);
	}
	.count {
		color: theme(colors.inkFaint);
	}
	.tag.active .count {
		color: theme(colors.sandDeep);
	}
</style>
