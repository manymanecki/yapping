import type { HighlighterCore } from 'shiki/core';
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

let highlighter: HighlighterCore | null = null;

async function getHighlighter(): Promise<HighlighterCore> {
	if (highlighter) return highlighter;

	highlighter = await createHighlighterCore({
		engine: createJavaScriptRegexEngine(),
		themes: [
			import('shiki/themes/github-light.mjs'),
			import('shiki/themes/github-dark.mjs')
		],
		langs: [import('shiki/langs/json.mjs')]
	});

	return highlighter;
}

export async function highlightJson(code: string): Promise<string> {
	const hl = await getHighlighter();
	return hl.codeToHtml(code, {
		lang: 'json',
		themes: {
			light: 'github-light',
			dark: 'github-dark'
		}
	});
}
