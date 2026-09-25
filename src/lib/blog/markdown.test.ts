import { describe, it, expect } from 'vitest';
import { renderMarkdown } from './markdown';

describe('renderMarkdown', () => {
	it('turns a lone image with a title into a captioned figure', () => {
		expect(
			renderMarkdown('![Seoul at dusk](/images/seoul.jpg "Here in Korea we love sunny days")')
		).toBe(
			'<figure><img loading="lazy" decoding="async" src="/images/seoul.jpg" alt="Seoul at dusk">' +
				'<figcaption>Here in Korea we love sunny days</figcaption></figure>\n'
		);
	});

	it('turns a lone image without a title into a bare figure', () => {
		expect(renderMarkdown('![Map](/images/map.png)')).toBe(
			'<figure><img loading="lazy" decoding="async" src="/images/map.png" alt="Map"></figure>\n'
		);
	});

	it('escapes captions', () => {
		expect(renderMarkdown('![x](/a.jpg "Tom & <Jerry>")')).toContain(
			'<figcaption>Tom &amp; &lt;Jerry&gt;</figcaption>'
		);
	});

	it('leaves images inside a sentence inline', () => {
		expect(renderMarkdown('Look ![icon](/i.png) here')).toBe(
			'<p>Look <img loading="lazy" decoding="async" src="/i.png" alt="icon"> here</p>\n'
		);
	});
});
