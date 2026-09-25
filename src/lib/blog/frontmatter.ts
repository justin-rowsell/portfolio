export type FrontmatterValue = string | boolean | string[];
export type Frontmatter = Record<string, FrontmatterValue>;

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function unquote(value: string): string {
	const v = value.trim();
	if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
		return v.slice(1, -1);
	}
	return v;
}

function parseScalar(raw: string): FrontmatterValue {
	let value = raw.trim();
	// Drop trailing `# comments` unless the value is quoted
	if (!/^["']/.test(value)) value = value.replace(/\s+#.*$/, '');
	if (value === 'true') return true;
	if (value === 'false') return false;
	if (value.startsWith('[') && value.endsWith(']')) {
		return value.slice(1, -1).split(',').map(unquote).filter(Boolean);
	}
	return unquote(value);
}

/**
 * Parses the small subset of YAML used in post frontmatter:
 * `key: value`, `key: [a, b]`, `key:` followed by `- item` lines, and true/false.
 */
export function parseFrontmatter(source: string): { data: Frontmatter; body: string } {
	const match = source.match(FENCE);
	if (!match) return { data: {}, body: source };

	const data: Frontmatter = {};
	let listKey: string | null = null;

	for (const line of match[1].split(/\r?\n/)) {
		if (!line.trim() || line.trim().startsWith('#')) continue;

		const item = line.match(/^\s*-\s+(.*)$/);
		if (item && listKey) {
			(data[listKey] as string[]).push(unquote(item[1]));
			continue;
		}

		const pair = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
		if (!pair) continue;

		const [, key, value] = pair;
		if (value.trim() === '') {
			data[key] = [];
			listKey = key;
		} else {
			data[key] = parseScalar(value);
			listKey = null;
		}
	}

	return { data, body: source.slice(match[0].length) };
}
