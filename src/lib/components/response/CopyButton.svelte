<script lang="ts">
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { Button } from '$lib/components/ui/button/index.js';

	interface Props {
		getText: () => string;
	}

	const { getText }: Props = $props();

	let copied = $state(false);

	async function copy() {
		await navigator.clipboard.writeText(getText());
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<Button variant="ghost" size="icon" class="h-7 w-7" onclick={copy}>
	{#if copied}
		<CheckIcon class="h-3.5 w-3.5 text-green-500" />
	{:else}
		<CopyIcon class="h-3.5 w-3.5" />
	{/if}
</Button>
