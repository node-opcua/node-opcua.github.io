// scripts/fetch-npm-version.mjs
// Fetches the latest version of node-opcua from npm registry.
// Returns the version string, or empty string on failure.

export async function fetchLatestVersion(packageName = "node-opcua") {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/${packageName}/latest`,
      { headers: { "Accept": "application/json" } }
    );
    if (!response.ok) return "";
    const data = await response.json();
    return data.version || "";
  } catch (err) {
    console.warn(`Could not fetch latest version: ${err.message}`);
    return "";
  }
}
