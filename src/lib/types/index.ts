import type { HttpMethod } from "$lib/constants/http";

export interface KeyValuePair {
	key: string;
	value: string;
	enabled: boolean;
}

export type AuthConfig =
	| { type: "none" }
	| { type: "bearer"; token: string }
	| { type: "basic"; username: string; password: string }
	| { type: "apiKey"; key: string; value: string; addTo: ApiKeyLocation };

export type ApiKeyLocation = "header" | "queryParam";

export type RequestBody =
	| { type: "none" }
	| { type: "json"; content: string }
	| { type: "formData"; fields: KeyValuePair[] }
	| { type: "urlEncoded"; fields: KeyValuePair[] };

export interface HttpRequest {
	method: HttpMethod;
	url: string;
	headers: KeyValuePair[];
	params: KeyValuePair[];
	body: RequestBody;
	auth: AuthConfig;
}

export interface HttpResponse {
	status: number;
	statusText: string;
	headers: KeyValuePair[];
	body: string;
	timeMs: number;
	sizeBytes: number;
}

export interface Tab {
	id: string;
	name: string;
	filePath: string | null;
	method: HttpMethod;
	url: string;
	isDirty: boolean;
	request: HttpRequest;
	response: HttpResponse | null;
}

export interface Workspace {
	path: string;
	name: string;
	collections: Collection[];
}

export interface Collection {
	name: string;
	path: string;
	entries: CollectionEntry[];
}

export type CollectionEntry =
	| { type: "folder"; name: string; path: string; entries: CollectionEntry[] }
	| { type: "request"; name: string; path: string; method: HttpMethod };

export interface RequestFile {
	name: string;
	method: HttpMethod;
	url: string;
	headers: KeyValuePair[];
	params: KeyValuePair[];
	body: RequestBody;
	auth: AuthConfig;
}

export interface Environment {
	name: string;
	variables: KeyValuePair[];
}
