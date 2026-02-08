<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import ResponseStatusBar from './ResponseStatusBar.svelte';
	import ResponseBodyView from './ResponseBodyView.svelte';
	import ResponseHeadersTable from './ResponseHeadersTable.svelte';
	import ResponseEmptyState from './ResponseEmptyState.svelte';
	import ResponseErrorState from './ResponseErrorState.svelte';
	import type { HttpResponse } from '$lib/types';

	interface Props {
		response: HttpResponse | null;
		loading: boolean;
		error: string | null;
	}

	const { response, loading, error }: Props = $props();
</script>

<div class="flex h-full flex-col overflow-hidden">
	{#if error}
		<ResponseErrorState {error} />
	{:else if response}
		<ResponseStatusBar {response} />
		<Tabs.Root value="body" class="flex flex-1 flex-col overflow-hidden">
			<Tabs.List>
				<Tabs.Trigger value="body">Body</Tabs.Trigger>
				<Tabs.Trigger value="headers">
					Headers ({response.headers.length})
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="body" class="flex-1 overflow-hidden">
				<ResponseBodyView body={response.body} headers={response.headers} />
			</Tabs.Content>
			<Tabs.Content value="headers" class="flex-1 overflow-hidden">
				<ResponseHeadersTable headers={response.headers} />
			</Tabs.Content>
		</Tabs.Root>
	{:else}
		<ResponseEmptyState {loading} />
	{/if}
</div>
