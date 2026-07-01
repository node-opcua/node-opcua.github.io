/**
 * Prefixes a path with the Astro BASE_URL.
 * Usage: url("projects/") → "/v2/projects/" in staging, "/projects/" in production.
 * Do NOT use for domain-root content (api_doc, Jekyll news posts).
 */
export const url = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
