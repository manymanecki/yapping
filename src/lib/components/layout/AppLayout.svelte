<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
	import MainView from '$lib/components/main/MainView.svelte';
</script>

<div class="flex h-screen w-screen overflow-hidden bg-background text-foreground">
	<Resizable.PaneGroup direction="horizontal" class="h-full">
		<Resizable.Pane defaultSize={30} minSize={20} maxSize={50}>
			<Sidebar />
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={70} minSize={50}>
			<MainView />
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
