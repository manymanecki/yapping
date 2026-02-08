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

export function getStatusCodeColor(status: number): string {
	if (status >= 200 && status < 300)
		return 'bg-green-500/15 text-green-700 dark:text-green-400';
	if (status >= 300 && status < 400)
		return 'bg-blue-500/15 text-blue-700 dark:text-blue-400';
	if (status >= 400 && status < 500)
		return 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400';
	if (status >= 500) return 'bg-red-500/15 text-red-700 dark:text-red-400';
	return 'bg-muted text-muted-foreground';
}
