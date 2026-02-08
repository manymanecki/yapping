<script lang="ts">
	import JsonBodyViewer from './JsonBodyViewer.svelte';
	import RawBodyViewer from './RawBodyViewer.svelte';
	import { getContentType } from '$lib/utils';
	import type { KeyValuePair } from '$lib/types';

	interface Props {
		body: string;
		headers: KeyValuePair[];
	}

	const { body, headers }: Props = $props();

	const contentType = $derived(getContentType(headers));
	const isJson = $derived(
		contentType.includes('application/json') || contentType.includes('+json')
	);
</script>

{#if isJson}
	<JsonBodyViewer {body} />
{:else}
	<RawBodyViewer {body} />
{/if}
