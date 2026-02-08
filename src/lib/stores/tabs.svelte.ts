import type { HttpMethod } from "$lib/constants/http";
import type { HttpRequest, HttpResponse, Tab } from "$lib/types";

function createDefaultRequest(): HttpRequest {
	return {
		method: "GET",
		url: "",
		headers: [],
		params: [],
		body: { type: "none" },
		auth: { type: "none" },
	};
}

function createTabStore() {
	let tabs = $state<Tab[]>([]);
	let activeTabId = $state<string | null>(null);

	const activeTab = $derived(tabs.find((t) => t.id === activeTabId) ?? null);

	function openTab(options?: {
		name?: string;
		filePath?: string | null;
		method?: HttpMethod;
		url?: string;
		request?: HttpRequest;
	}) {
		// If filePath is provided, check if a tab already exists for it
		if (options?.filePath) {
			const existing = tabs.find((t) => t.filePath === options.filePath);
			if (existing) {
				activeTabId = existing.id;
				return;
			}
		}

		const id = crypto.randomUUID();
		const tab: Tab = {
			id,
			name: options?.name ?? "Untitled",
			filePath: options?.filePath ?? null,
			method: options?.method ?? "GET",
			url: options?.url ?? "",
			isDirty: false,
			request: options?.request ?? createDefaultRequest(),
			response: null,
		};

		tabs.push(tab);
		activeTabId = id;
	}

	function closeTab(id: string) {
		const index = tabs.findIndex((t) => t.id === id);
		if (index === -1) return;

		tabs.splice(index, 1);

		if (activeTabId === id) {
			// Activate the nearest tab
			if (tabs.length === 0) {
				activeTabId = null;
			} else {
				const newIndex = Math.min(index, tabs.length - 1);
				activeTabId = tabs[newIndex].id;
			}
		}
	}

	function setActiveTab(id: string) {
		activeTabId = id;
	}

	function updateTab(id: string, updates: Partial<Pick<Tab, "name" | "method" | "url" | "isDirty" | "request" | "response">>) {
		const tab = tabs.find((t) => t.id === id);
		if (tab) {
			Object.assign(tab, updates);
		}
	}

	return {
		get tabs() {
			return tabs;
		},
		get activeTab() {
			return activeTab;
		},
		get activeTabId() {
			return activeTabId;
		},
		openTab,
		closeTab,
		setActiveTab,
		updateTab,
	};
}

export const tabStore = createTabStore();
