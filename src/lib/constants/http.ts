export const HTTP_METHODS = [
	"GET",
	"POST",
	"PUT",
	"PATCH",
	"DELETE",
	"HEAD",
	"OPTIONS",
] as const;

export type HttpMethod = (typeof HTTP_METHODS)[number];

export const METHOD_COLORS: Record<HttpMethod, string> = {
	GET: "text-green-500",
	POST: "text-yellow-500",
	PUT: "text-blue-500",
	PATCH: "text-purple-500",
	DELETE: "text-red-500",
	HEAD: "text-gray-500",
	OPTIONS: "text-gray-500",
};
