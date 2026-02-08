<script lang="ts">
	import './layout.css';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	const { children } = $props();
</script>

<Tooltip.Provider>
	{@render children()}
</Tooltip.Provider>
