<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import FolderOpenIcon from '@lucide/svelte/icons/folder-open';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { workspaceStore } from '$lib/stores/workspace.svelte';
	import { tabStore } from '$lib/stores/tabs.svelte';
</script>

<div class="flex h-full flex-col border-r bg-muted/30">
	<div class="flex items-center justify-between px-4 py-3">
		<h2 class="truncate text-sm font-semibold">
			{workspaceStore.isOpen ? workspaceStore.name : 'No Workspace'}
		</h2>
		<div class="flex gap-1">
			<Button variant="ghost" size="icon-sm" aria-label="Open workspace">
				<FolderOpenIcon />
			</Button>
			<Button
				variant="ghost"
				size="icon-sm"
				aria-label="New request"
				onclick={() => tabStore.openTab()}
			>
				<PlusIcon />
			</Button>
		</div>
	</div>

	<Separator />

	<ScrollArea class="flex-1">
		<div class="p-2">
			{#if !workspaceStore.isOpen}
				<div class="flex flex-col items-center gap-3 px-4 py-8 text-center">
					<FolderOpenIcon class="h-10 w-10 text-muted-foreground/50" />
					<div class="space-y-1">
						<p class="text-sm font-medium text-muted-foreground">No workspace open</p>
						<p class="text-xs text-muted-foreground/70">Open a folder to get started</p>
					</div>
				</div>
			{:else if workspaceStore.collections.length === 0}
				<p class="px-4 py-8 text-center text-xs text-muted-foreground">
					No collections yet
				</p>
			{:else}
				{#each workspaceStore.collections as collection (collection.path)}
					<div class="rounded-md px-2 py-1 text-sm">{collection.name}</div>
				{/each}
			{/if}
		</div>
	</ScrollArea>
</div>
