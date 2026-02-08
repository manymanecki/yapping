<script lang="ts">
	import { invoke } from '@tauri-apps/api/core';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import SendIcon from '@lucide/svelte/icons/send';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';
	import { tabStore } from '$lib/stores/tabs.svelte';
	import { HTTP_METHODS, METHOD_COLORS } from '$lib/constants/http';
	import type { HttpMethod } from '$lib/constants/http';
	import type { HttpRequest, HttpResponse, Tab } from '$lib/types';

	interface Props {
		tab: Tab;
	}

	const { tab }: Props = $props();

	let loading = $state(false);
	let error = $state<string | null>(null);

	function onMethodChange(value: string | undefined) {
		if (value) {
			tabStore.updateTab(tab.id, { method: value as HttpMethod, isDirty: true });
		}
	}

	function onUrlInput(e: Event) {
		const target = e.target as HTMLInputElement;
		tabStore.updateTab(tab.id, { url: target.value, isDirty: true });
	}

	function onUrlKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			sendRequest();
		}
	}

	async function sendRequest() {
		if (loading || !tab.url.trim()) return;

		loading = true;
		error = null;

		try {
			const request: HttpRequest = {
				method: tab.method,
				url: tab.url,
				headers: tab.request.headers,
				params: tab.request.params,
				body: tab.request.body,
				auth: tab.request.auth
			};

			const response = await invoke<HttpResponse>('execute_request', { request });
			tabStore.updateTab(tab.id, { response });
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
			tabStore.updateTab(tab.id, { response: null });
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex flex-1 flex-col overflow-hidden">
	<!-- Method + URL bar -->
	<div class="flex items-center gap-2 border-b px-4 py-2">
		<Select.Root type="single" value={tab.method} onValueChange={onMethodChange}>
			<Select.Trigger class="w-30 font-mono font-bold {METHOD_COLORS[tab.method]}">
				{tab.method}
			</Select.Trigger>
			<Select.Content>
				{#each HTTP_METHODS as method (method)}
					<Select.Item value={method}>
						<span class="font-mono font-bold {METHOD_COLORS[method]}">{method}</span>
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		<Input
			class="flex-1 font-mono text-sm"
			placeholder="Enter URL..."
			value={tab.url}
			oninput={onUrlInput}
			onkeydown={onUrlKeydown}
		/>

		<Button size="sm" class="gap-2" onclick={sendRequest} disabled={loading || !tab.url.trim()}>
			{#if loading}
				<LoaderCircleIcon class="h-4 w-4 animate-spin" />
				Sending
			{:else}
				<SendIcon class="h-4 w-4" />
				Send
			{/if}
		</Button>
	</div>

	<!-- Request / Response split -->
	<Resizable.PaneGroup direction="vertical" class="flex-1">
		<Resizable.Pane defaultSize={50} minSize={20}>
			<div class="flex h-full flex-col">
				<div class="flex items-center gap-4 border-b px-4 py-2">
					<button class="text-sm font-medium text-foreground">Params</button>
					<button class="text-sm text-muted-foreground hover:text-foreground">Headers</button>
					<button class="text-sm text-muted-foreground hover:text-foreground">Body</button>
					<button class="text-sm text-muted-foreground hover:text-foreground">Auth</button>
				</div>
				<div class="flex-1 p-4 text-sm text-muted-foreground">
					Request editor placeholder
				</div>
			</div>
		</Resizable.Pane>
		<Resizable.Handle />
		<Resizable.Pane defaultSize={50} minSize={20}>
			<div class="flex h-full flex-col">
				{#if error}
					<div class="flex items-center gap-4 border-b px-4 py-2">
						<span class="text-sm font-medium text-destructive">Error</span>
					</div>
					<div class="flex-1 overflow-auto p-4">
						<p class="text-sm text-destructive">{error}</p>
					</div>
				{:else if tab.response}
					<div class="flex items-center gap-4 border-b px-4 py-2">
						<span class="text-sm font-medium">
							Status: <span class="font-mono">{tab.response.status} {tab.response.statusText}</span>
						</span>
						<Separator orientation="vertical" class="h-4" />
						<span class="text-sm text-muted-foreground">
							{tab.response.timeMs}ms
						</span>
						<Separator orientation="vertical" class="h-4" />
						<span class="text-sm text-muted-foreground">
							{tab.response.sizeBytes} B
						</span>
					</div>
					<div class="flex-1 overflow-auto p-4">
						<pre class="text-sm">{tab.response.body}</pre>
					</div>
				{:else}
					<div class="flex flex-1 items-center justify-center text-sm text-muted-foreground">
						Send a request to see the response
					</div>
				{/if}
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
