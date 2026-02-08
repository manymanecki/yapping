<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { themeStore } from '$lib/stores/theme.svelte';

	const { children } = $props();

	onMount(() => {
		themeStore.init();
	});
</script>

<Tooltip.Provider>
	{@render children()}
</Tooltip.Provider>
