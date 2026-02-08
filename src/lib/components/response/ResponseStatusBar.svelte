<script lang="ts">
	import ClockIcon from '@lucide/svelte/icons/clock';
	import HardDriveIcon from '@lucide/svelte/icons/hard-drive';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { getStatusCodeColor } from '$lib/constants/http';
	import { formatBytes } from '$lib/utils';
	import type { HttpResponse } from '$lib/types';

	interface Props {
		response: HttpResponse;
	}

	const { response }: Props = $props();

	const statusColor = $derived(getStatusCodeColor(response.status));
	const formattedSize = $derived(formatBytes(response.sizeBytes));
</script>

<div class="flex items-center gap-3 border-b px-4 py-1.5">
	<span class="rounded-md px-2 py-0.5 text-xs font-semibold {statusColor}">
		{response.status} {response.statusText}
	</span>

	<Separator orientation="vertical" class="h-4" />

	<div class="flex items-center gap-1 text-xs text-muted-foreground">
		<ClockIcon class="h-3 w-3" />
		<span>{response.timeMs} ms</span>
	</div>

	<Separator orientation="vertical" class="h-4" />

	<div class="flex items-center gap-1 text-xs text-muted-foreground">
		<HardDriveIcon class="h-3 w-3" />
		<span>{formattedSize}</span>
	</div>
</div>
