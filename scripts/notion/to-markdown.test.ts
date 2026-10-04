import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '../../src/lib/blog/markdown';
import { blocksToMarkdown, type Block, type RichText } from './to-markdown';

type Style = Partial<RichText['annotations']> & { href?: string };

function t(text: string, style: Style = {}): RichText {
	const { href = null, ...annotations } = style;
	return {
		type: 'text',
		plain_text: text,
		href,
		annotations: {
			bold: false,
			italic: false,
			strikethrough: false,
			underline: false,
			code: false,
			color: 'default',
			...annotations
		}
	};
}

let n = 0;
function b(type: string, data: object = {}, children?: Block[]): Block {
	n += 1;
	return {
		id: `0000000${n}`.slice(-8) + '-0000-0000-0000-000000000000',
		type,
		has_children: !!children,
		children,
		[type]: data
	};
}

const p = (...text: RichText[]) => b('paragraph', { rich_text: text });
const md = (...blocks: Block[]) => blocksToMarkdown(blocks).trim();
const html = (...blocks: Block[]) => renderMarkdown(blocksToMarkdown(blocks)).trim();

describe('inline formatting', () => {
	it('writes markdown for bold, italic, strikethrough, code, and links', () => {
		expect(
			md(
				p(
					t('A '),
					t('bold', { bold: true }),
					t(', '),
					t('italic', { italic: true }),
					t(', '),
					t('gone', { strikethrough: true }),
					t(', '),
					t('npm run dev', { code: true }),
					t(' and '),
					t('a link', { href: 'https://example.com' }),
					t('.')
				)
			)
		).toBe('A **bold**, *italic*, ~~gone~~, `npm run dev` and [a link](https://example.com).');
	});

	it('keeps spaces outside the markers', () => {
		expect(md(p(t('Hello '), t('big ', { bold: true }), t('world')))).toBe('Hello **big** world');
	});

	it('merges runs that Notion split but styled the same', () => {
		expect(md(p(t('one ', { bold: true }), t('two', { bold: true })))).toBe('**one two**');
	});

	it('uses HTML tags mid-word, where markdown markers would show as asterisks', () => {
		expect(html(p(t('un'), t('believ', { bold: true }), t('able')))).toBe(
			'<p>un<strong>believ</strong>able</p>'
		);
	});

	it('handles back-to-back runs with different styles', () => {
		expect(html(p(t('bold', { bold: true }), t('both', { bold: true, italic: true })))).toBe(
			'<p><strong>bold</strong><em><strong>both</strong></em></p>'
		);
	});

	it('keeps underline and colors', () => {
		expect(
			html(
				p(
					t('under', { underline: true }),
					t(' '),
					t('red', { color: 'red' }),
					t(' '),
					t('hi', { color: 'yellow_background' })
				)
			)
		).toBe(
			'<p><u>under</u> <span class="notion-red">red</span> <mark class="notion-yellow_background">hi</mark></p>'
		);
	});

	it('escapes characters that would otherwise become markdown', () => {
		expect(html(p(t('2 * 3 = 6, [not a link], <b>not bold</b>, snake_case, _x_')))).toBe(
			'<p>2 * 3 = 6, [not a link], &lt;b&gt;not bold&lt;/b&gt;, snake_case, _x_</p>'
		);
	});

	it('does not let a paragraph turn into a heading or list', () => {
		expect(html(p(t('# not a heading')), p(t('- not a list')), p(t('1. not a list')))).toBe(
			'<p># not a heading</p>\n<p>- not a list</p>\n<p>1. not a list</p>'
		);
	});

	it('turns soft line breaks into <br>', () => {
		expect(html(p(t('line one\nline two')))).toBe('<p>line one<br>line two</p>');
	});

	it('drops links to other Notion pages', () => {
		const warnings: string[] = [];
		const out = blocksToMarkdown([p(t('see this', { href: '/abc123' }))], {
			warn: (m) => warnings.push(m)
		});
		expect(out.trim()).toBe('see this');
		expect(warnings).toHaveLength(1);
	});
});

describe('blocks', () => {
	it('shifts headings down one level, since the post title is the h1', () => {
		expect(
			md(b('heading_1', { rich_text: [t('One')] }), b('heading_3', { rich_text: [t('Three')] }))
		).toBe('## One\n\n#### Three');
	});

	it('writes nested lists and checklists', () => {
		expect(
			md(
				b('bulleted_list_item', { rich_text: [t('a')] }, [
					b('numbered_list_item', { rich_text: [t('a1')] }),
					b('numbered_list_item', { rich_text: [t('a2')] })
				]),
				b('bulleted_list_item', { rich_text: [t('b')] }),
				b('to_do', { rich_text: [t('done')], checked: true }),
				b('to_do', { rich_text: [t('todo')], checked: false })
			)
		).toBe('- a\n  1. a1\n  1. a2\n- b\n\n- [x] done\n- [ ] todo');
	});

	it('renders checklists as disabled checkboxes', () => {
		expect(html(b('to_do', { rich_text: [t('done')], checked: true }))).toContain(
			'<input checked="" disabled="" type="checkbox"> done'
		);
	});

	it('writes quotes, including multi-paragraph ones', () => {
		expect(md(b('quote', { rich_text: [t('first')] }, [p(t('second'))]))).toBe(
			'> first\n>\n> second'
		);
	});

	it('writes callouts with their emoji, color, and formatted body', () => {
		const out = html(
			b('callout', {
				rich_text: [t('Heads '), t('up', { bold: true })],
				icon: { type: 'emoji', emoji: '💡' },
				color: 'blue_background'
			})
		);
		expect(out).toBe(
			'<aside class="callout notion-blue_background">\n' +
				'<span class="callout-icon" aria-hidden="true">💡</span>\n' +
				'<div class="callout-body">\n\n' +
				'<p>Heads <strong>up</strong></p>\n' +
				'</div>\n</aside>'
		);
	});

	it('writes toggles as <details> with markdown inside', () => {
		const out = html(
			b('toggle', { rich_text: [t('More')] }, [p(t('hidden '), t('stuff', { italic: true }))])
		);
		expect(out).toBe(
			'<details>\n<summary>\n\n<p>More</p>\n</summary>\n\n<p>hidden <em>stuff</em></p>\n</details>'
		);
	});

	it('writes toggle headings', () => {
		expect(
			html(b('heading_2', { rich_text: [t('FAQ')], is_toggleable: true }, [p(t('A'))]))
		).toContain('<summary>\n\n<h3 id="faq">FAQ</h3>\n</summary>');
	});

	it('writes code with its language, even when it contains backticks', () => {
		expect(md(b('code', { rich_text: [t('const a = 1;')], language: 'javascript' }))).toBe(
			'```javascript\nconst a = 1;\n```'
		);
		expect(md(b('code', { rich_text: [t('```\nnested\n```')], language: 'plain text' }))).toBe(
			'````\n```\nnested\n```\n````'
		);
	});

	it('uses downloaded image paths and turns captions into figure captions', () => {
		const image = b('image', {
			type: 'file',
			file: { url: 'https://s3.amazonaws.com/expiring.jpg' },
			caption: [t('The "best" view')]
		});
		const assets = new Map([[image.id, '/images/post/abc.jpg']]);
		const out = renderMarkdown(blocksToMarkdown([image], { assets }));
		expect(out).toBe(
			'<figure><img loading="lazy" decoding="async" src="/images/post/abc.jpg" alt="The &quot;best&quot; view">' +
				'<figcaption>The &quot;best&quot; view</figcaption></figure>\n'
		);
	});

	it('embeds YouTube videos and links other bookmarks', () => {
		expect(
			md(b('video', { type: 'external', external: { url: 'https://youtu.be/dQw4w9WgXcQ' } }))
		).toContain('src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"');
		expect(md(b('bookmark', { url: 'https://example.com/a', caption: [] }))).toBe(
			'[https://example.com/a](https://example.com/a)'
		);
	});

	it('writes tables, with or without a header row', () => {
		const row = (...cells: string[]) => b('table_row', { cells: cells.map((c) => [t(c)]) });
		expect(md(b('table', { has_column_header: true }, [row('A', 'B'), row('1', 'x|y')]))).toBe(
			'| A | B |\n| --- | --- |\n| 1 | x\\|y |'
		);
		expect(md(b('table', { has_column_header: false }, [row('1', '2')]))).toBe(
			'|   |   |\n| --- | --- |\n| 1 | 2 |'
		);
	});

	it('writes columns side by side', () => {
		const out = html(
			b('column_list', {}, [b('column', {}, [p(t('left'))]), b('column', {}, [p(t('right'))])])
		);
		expect(out).toBe(
			'<div class="columns">\n\n<div class="column">\n\n<p>left</p>\n</div>\n\n' +
				'<div class="column">\n\n<p>right</p>\n</div>\n\n</div>'
		);
	});

	it('skips empty paragraphs and warns about sub-pages', () => {
		const warnings: string[] = [];
		const out = blocksToMarkdown([p(t('a')), p(), b('child_page', { title: 'x' }), p(t('b'))], {
			warn: (m) => warnings.push(m)
		});
		expect(out).toBe('a\n\nb\n');
		expect(warnings).toHaveLength(1);
	});
});
