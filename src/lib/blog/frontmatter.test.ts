import { describe, it, expect } from 'vitest';
import { parseFrontmatter } from './frontmatter';

describe('parseFrontmatter', () => {
	it('parses scalars, inline lists, and booleans', () => {
		const { data, body } = parseFrontmatter(
			[
				'---',
				'title: "Why I killed this idea: a note"',
				'date: 2026-09-24',
				'tags: [climate, "building solo"]',
				'draft: true',
				'---',
				'',
				'Hello.'
			].join('\n')
		);

		expect(data).toEqual({
			title: 'Why I killed this idea: a note',
			date: '2026-09-24',
			tags: ['climate', 'building solo'],
			draft: true
		});
		expect(body).toBe('\nHello.');
	});

	it('parses block lists', () => {
		const { data } = parseFrontmatter(
			['---', 'tags:', '  - AI tutoring', '  - CTO work', 'title: Hi', '---', 'x'].join('\n')
		);
		expect(data.tags).toEqual(['AI tutoring', 'CTO work']);
		expect(data.title).toBe('Hi');
	});

	it('ignores trailing comments on unquoted values', () => {
		const { data } = parseFrontmatter(
			[
				'---',
				'updated: 2026-10-02   # optional',
				'draft: true # hide',
				'title: "A # B"',
				'---'
			].join('\n')
		);
		expect(data).toEqual({ updated: '2026-10-02', draft: true, title: 'A # B' });
	});

	it('returns the whole source as body when there is no frontmatter', () => {
		expect(parseFrontmatter('# Just markdown')).toEqual({ data: {}, body: '# Just markdown' });
	});
});
