#!/usr/bin/env node
/**
 * Inject noindex + deprecation banner into a single version folder.
 * Usage: node inject_single_version.mjs <version_dir> <version> <current_version>
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const NOINDEX_MARKER = "<!-- NODEOPCUA-NOINDEX -->";
const BANNER_START = "<!-- NODEOPCUA-DEPRECATION-BANNER -->";
const BANNER_END = "<!-- /NODEOPCUA-DEPRECATION-BANNER -->";

const versionDir = process.argv[2];
const version = process.argv[3];
const currentVersion = process.argv[4];

if (!versionDir || !version || !currentVersion) {
    console.error("Usage: node inject_single_version.mjs <dir> <version> <current>");
    process.exit(1);
}

function walk(dir) {
    const results = [];
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, e.name);
        if (e.isDirectory()) results.push(...walk(full));
        else if (e.name.endsWith(".html")) results.push(full);
    }
    return results;
}

function makeBanner(oldVer, curVer) {
    return [
        BANNER_START,
        '<div style="background:#fff3cd;border-bottom:2px solid '
          + '#ffc107;padding:12px;text-align:center;font-family:'
          + 'sans-serif;font-size:14px">',
        `\u26a0\ufe0f You are reading documentation for an OLD `
          + `version (v${oldVer}). The current released version `
          + `is v${curVer}.`,
        '<a href="/api_doc/latest/" style="font-weight:bold;'
          + 'color:#856404">View latest documentation \u2192</a>',
        "</div>",
        BANNER_END,
    ].join("\n");
}

const files = walk(versionDir);
let modified = 0;

for (const f of files) {
    let html = readFileSync(f, "utf-8");

    // Already fully processed — skip (idempotency)
    if (html.includes(NOINDEX_MARKER) && html.includes(BANNER_START)) {
        continue;
    }

    let changed = false;

    if (!html.includes(NOINDEX_MARKER)) {
        const m = html.match(/<head[^>]*>/i);
        if (m) {
            const pos = m.index + m[0].length;
            html = html.slice(0, pos) + "\n"
                 + NOINDEX_MARKER
                 + '<meta name="robots" content="noindex,follow">\n'
                 + html.slice(pos);
            changed = true;
        }
    }

    if (!html.includes(BANNER_START)) {
        const m = html.match(/<body[^>]*>/i);
        if (m) {
            const pos = m.index + m[0].length;
            html = html.slice(0, pos) + "\n"
                 + makeBanner(version, currentVersion) + "\n"
                 + html.slice(pos);
            changed = true;
        }
    }

    if (changed) {
        writeFileSync(f, html, "utf-8");
        modified++;
    }
}

console.log(`${version}: ${modified}/${files.length} files modified`);
