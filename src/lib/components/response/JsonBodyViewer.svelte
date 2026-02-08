<script lang="ts">
	import CopyButton from './CopyButton.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { highlightJson } from '$lib/highlight';
	import { tryFormatJson, LARGE_BODY_THRESHOLD, formatBytes } from '$lib/utils';

	interface Props {
		body: string;
	}

	const { body }: Props = $props();

	let viewMode = $state<'pretty' | 'raw'>('pretty');
	let highlightedHtml = $state('');

	const isLarge = $derived(body.length > LARGE_BODY_THRESHOLD);
	const displayBody = $derived(
		viewMode === 'pretty' && !isLarge ? tryFormatJson(body) : body
	);

	$effect(() => {
		if (viewMode !== 'pretty') {
			highlightedHtml = '';
			return;
		}

		const code = displayBody;
		highlightedHtml = '';

		highlightJson(code).then((html) => {
			if (viewMode === 'pretty' && displayBody === code) {
				highlightedHtml = html;
			}
		});
	});
</script>

<div class="flex h-full flex-col overflow-hidden">
	<div class="flex items-center gap-2 border-b px-2 py-1">
		<div class="flex items-center rounded-md bg-muted p-0.5">
			<button
				class="rounded px-2 py-0.5 text-xs transition-colors {viewMode === 'pretty'
					? 'bg-background font-medium shadow-sm'
					: 'text-muted-foreground hover:text-foreground'}"
				onclick={() => (viewMode = 'pretty')}
			>
				Pretty
			</button>
			<button
				class="rounded px-2 py-0.5 text-xs transition-colors {viewMode === 'raw'
					? 'bg-background font-medium shadow-sm'
					: 'text-muted-foreground hover:text-foreground'}"
				onclick={() => (viewMode = 'raw')}
			>
				Raw
			</button>
		</div>

		{#if isLarge && viewMode === 'pretty'}
			<span class="text-xs text-muted-foreground">
				Response too large to format ({formatBytes(body.length)})
			</span>
		{/if}

		<div class="ml-auto">
			<CopyButton getText={() => displayBody} />
		</div>
	</div>
	<ScrollArea class="flex-1">
		{#if viewMode === 'pretty' && highlightedHtml}
			<!-- Safe: Shiki's codeToHtml() tokenizes a raw string, does not pass through input HTML -->
			<div
				class="shiki-wrapper p-4 text-sm"
				style="white-space: pre-wrap; overflow-wrap: break-word;"
			>
				{@html highlightedHtml}
			</div>
		{:else}
			<pre
				class="p-4 font-mono text-sm"
				style="white-space: pre-wrap; overflow-wrap: break-word;"
			><code>{displayBody}</code></pre>
		{/if}
	</ScrollArea>
</div>
