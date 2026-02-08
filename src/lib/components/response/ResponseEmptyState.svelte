<script lang="ts">
	import SendIcon from '@lucide/svelte/icons/send';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';

	interface Props {
		loading: boolean;
	}

	const { loading }: Props = $props();
</script>

<div class="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
	{#if loading}
		<LoaderCircleIcon class="h-8 w-8 animate-spin" />
		<span class="text-sm">Sending request...</span>
	{:else}
		<SendIcon class="h-8 w-8" />
		<span class="text-sm">Send a request to see the response</span>
	{/if}
</div>
