<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import XIcon from '@lucide/svelte/icons/x';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { tabStore } from '$lib/stores/tabs.svelte';
	import { METHOD_COLORS } from '$lib/constants/http';
</script>

<div class="flex items-center border-b bg-muted/20">
	<ScrollArea orientation="horizontal" class="flex-1">
		<div class="flex">
			{#each tabStore.tabs as tab (tab.id)}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="group flex min-w-0 max-w-[200px] shrink-0 cursor-pointer items-center gap-2 border-r px-3 py-2 text-sm transition-colors hover:bg-muted/50 {tabStore.activeTabId ===
					tab.id
						? 'bg-background'
						: ''}"
					onclick={() => tabStore.setActiveTab(tab.id)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') tabStore.setActiveTab(tab.id);
					}}
					role="tab"
					tabindex="0"
					aria-selected={tabStore.activeTabId === tab.id}
				>
					<span class="text-xs font-bold {METHOD_COLORS[tab.method]}">
						{tab.method}
					</span>
					<span class="truncate text-muted-foreground">
						{tab.name}
					</span>
					{#if tab.isDirty}
						<span class="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400"></span>
					{/if}
					<button
						class="ml-auto shrink-0 rounded p-0.5 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
						onclick={(e) => {
							e.stopPropagation();
							tabStore.closeTab(tab.id);
						}}
						aria-label="Close tab"
					>
						<XIcon class="h-3 w-3" />
					</button>
				</div>
			{/each}
		</div>
	</ScrollArea>

	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="ghost"
					size="icon-sm"
					class="mx-1 shrink-0"
					onclick={() => tabStore.openTab()}
					aria-label="New request"
				>
					<PlusIcon class="h-4 w-4" />
				</Button>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>New Request</p>
		</Tooltip.Content>
	</Tooltip.Root>
</div>
