<script lang="ts">
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';

	interface Props {
		error: string;
	}

	const { error }: Props = $props();
</script>

<div class="flex flex-1 flex-col items-center justify-center gap-3 text-destructive">
	<CircleAlertIcon class="h-8 w-8" />
	<span class="text-sm font-medium">Request Failed</span>
	<p class="max-w-md text-center text-sm text-destructive/80">{error}</p>
</div>
