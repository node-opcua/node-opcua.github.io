/**
 * Prefixes a path with the Astro BASE_URL.
 * Usage: url("projects.html") → "/v2/projects.html" in staging, "/projects.html" in production.
 * Usage: url("logos/foo.png") → "/v2/logos/foo.png" in staging, "/logos/foo.png" in production.
 * Do NOT use for domain-root content (api_doc, external URLs).
 */
export const url = (path: string) => {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalizedBase}${path.replace(/^\//, "")}`;
};
