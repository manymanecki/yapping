<script lang="ts">
	import CopyButton from './CopyButton.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

	interface Props {
		body: string;
	}

	const { body }: Props = $props();
</script>

<div class="flex h-full flex-col overflow-hidden">
	<div class="flex items-center justify-end border-b px-2 py-1">
		<CopyButton getText={() => body} />
	</div>
	<ScrollArea class="flex-1">
		<pre
			class="p-4 font-mono text-sm"
			style="white-space: pre-wrap; overflow-wrap: break-word;"
		><code>{body}</code></pre>
	</ScrollArea>
</div>
