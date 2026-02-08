<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import type { KeyValuePair } from '$lib/types';

	interface Props {
		headers: KeyValuePair[];
	}

	const { headers }: Props = $props();
</script>

<ScrollArea class="h-full">
	<table class="w-full text-sm">
		<thead>
			<tr class="border-b">
				<th class="px-4 py-2 text-left font-medium text-muted-foreground">Name</th>
				<th class="px-4 py-2 text-left font-medium text-muted-foreground">Value</th>
			</tr>
		</thead>
		<tbody>
			{#each headers as header, i (i)}
				<tr class="border-b last:border-b-0">
					<td class="px-4 py-1.5 font-mono text-xs font-medium">{header.key}</td>
					<td class="break-all px-4 py-1.5 font-mono text-xs text-muted-foreground">
						{header.value}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</ScrollArea>
