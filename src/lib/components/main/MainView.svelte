<script lang="ts">
	import TabBar from './TabBar.svelte';
	import RequestView from './RequestView.svelte';
	import { tabStore } from '$lib/stores/tabs.svelte';
	import SendIcon from '@lucide/svelte/icons/send';
</script>

<div class="flex h-full flex-col">
	{#if tabStore.tabs.length > 0}
		<TabBar />
		{#if tabStore.activeTab}
			<RequestView tab={tabStore.activeTab} />
		{/if}
	{:else}
		<div class="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
			<SendIcon class="h-16 w-16 text-muted-foreground/20" />
			<div class="space-y-1 text-center">
				<p class="text-lg font-medium">No open requests</p>
				<p class="text-sm text-muted-foreground/70">
					Open a request from the sidebar or create a new one
				</p>
			</div>
		</div>
	{/if}
</div>
