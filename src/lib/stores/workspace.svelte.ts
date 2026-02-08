import type { Collection, Workspace } from "$lib/types";

function createWorkspaceStore() {
	let workspace = $state<Workspace | null>(null);

	const isOpen = $derived(workspace !== null);
	const name = $derived(workspace?.name ?? "");
	const collections = $derived(workspace?.collections ?? []);

	function setWorkspace(ws: Workspace) {
		workspace = ws;
	}

	function updateCollections(colls: Collection[]) {
		if (workspace) {
			workspace.collections = colls;
		}
	}

	function close() {
		workspace = null;
	}

	return {
		get workspace() {
			return workspace;
		},
		get isOpen() {
			return isOpen;
		},
		get name() {
			return name;
		},
		get collections() {
			return collections;
		},
		setWorkspace,
		updateCollections,
		close,
	};
}

export const workspaceStore = createWorkspaceStore();
