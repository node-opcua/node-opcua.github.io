#!/usr/bin/env node
/**
 * Inject noindex meta tags and deprecation banners into old
 * NodeOPCUA API doc versions. Idempotent — skips files that
 * already have the injection markers.
 *
 * Usage:
 *   node inject_banners.mjs [api_doc_dir] [current_version]
 *   node inject_banners.mjs ./api_doc 2.173.1
 */

import { readdir, readFile, writeFile, cp, rm, stat }
    from "node:fs/promises";
import { join, relative, posix } from "node:path";

const NOINDEX_MARKER = "<!-- NODEOPCUA-NOINDEX -->";
const BANNER_START = "<!-- NODEOPCUA-DEPRECATION-BANNER -->";
const BANNER_END = "<!-- /NODEOPCUA-DEPRECATION-BANNER -->";
const CANONICAL_MARKER = "<!-- NODEOPCUA-CANONICAL -->";

let CURRENT_VERSION = "2.173.1";

function makeBannerHtml(oldVersion) {
    return [
        BANNER_START,
        '<div style="background:#fff3cd;border-bottom:2px solid ' +
        '#ffc107;padding:12px;text-align:center;font-family:' +
        'sans-serif;font-size:14px">',
        `\u26a0\ufe0f You are reading documentation for an OLD ` +
        `version (v${oldVersion}). The current released version ` +
        `is v${CURRENT_VERSION}.`,
        '<a href="/api_doc/latest/" style="font-weight:bold;' +
        'color:#856404">View latest documentation \u2192</a>',
        "</div>",
        BANNER_END,
    ].join("\n");
}

function makeNoindexHtml() {
    return `${NOINDEX_MARKER}<meta name="robots" ` +
           `content="noindex,follow">\n`;
}

function makeCanonicalHtml(relPath) {
    const url =
        `https://node-opcua.github.io/api_doc/latest/${relPath}`;
    return `${CANONICAL_MARKER}<link rel="canonical" ` +
           `href="${url}">\n`;
}

/** Recursively find all .html files under a directory. */
async function findHtmlFiles(dir) {
    const results = [];
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...await findHtmlFiles(full));
        } else if (entry.name.endsWith(".html")) {
            results.push(full);
        }
    }
    return results;
}

/**
 * Inject noindex + deprecation banner into one HTML file.
 * Returns true if the file was modified.
 */
async function injectIntoOldVersion(htmlFile, version) {
    let content;
    try {
        content = await readFile(htmlFile, "utf-8");
    } catch {
        return false;
    }

    if (content.includes(NOINDEX_MARKER) &&
        content.includes(BANNER_START)) {
        return false; // already processed
    }

    let modified = false;

    // Inject noindex into <head>
    if (!content.includes(NOINDEX_MARKER)) {
        const headMatch = content.match(/<head[^>]*>/i);
        if (headMatch) {
            const pos = headMatch.index + headMatch[0].length;
            content = content.slice(0, pos) + "\n" +
                      makeNoindexHtml() + content.slice(pos);
            modified = true;
        }
    }

    // Inject banner after <body>
    if (!content.includes(BANNER_START)) {
        const bodyMatch = content.match(/<body[^>]*>/i);
        if (bodyMatch) {
            const pos = bodyMatch.index + bodyMatch[0].length;
            content = content.slice(0, pos) + "\n" +
                      makeBannerHtml(version) + "\n" +
                      content.slice(pos);
            modified = true;
        }
    }

    if (modified) {
        await writeFile(htmlFile, content, "utf-8");
    }
    return modified;
}

/**
 * Add canonical link to files in /latest/.
 * Returns true if the file was modified.
 */
async function injectCanonical(htmlFile, latestDir) {
    let content;
    try {
        content = await readFile(htmlFile, "utf-8");
    } catch {
        return false;
    }

    if (content.includes(CANONICAL_MARKER)) {
        return false;
    }

    const relPath = relative(latestDir, htmlFile)
        .split("\\").join("/"); // normalize to posix

    const headMatch = content.match(/<head[^>]*>/i);
    if (headMatch) {
        const pos = headMatch.index + headMatch[0].length;
        content = content.slice(0, pos) + "\n" +
                  makeCanonicalHtml(relPath) + content.slice(pos);
        await writeFile(htmlFile, content, "utf-8");
        return true;
    }
    return false;
}

/** Compare version strings numerically. */
function compareVersions(a, b) {
    const pa = a.split(".").map(Number);
    const pb = b.split(".").map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const va = pa[i] || 0;
        const vb = pb[i] || 0;
        if (va !== vb) return va - vb;
    }
    return 0;
}

async function main() {
    const apiDocDir = process.argv[2] || "api_doc";
    if (process.argv[3]) {
        CURRENT_VERSION = process.argv[3];
    }

    // Find all version directories
    const entries = await readdir(apiDocDir, {
        withFileTypes: true,
    });
    const versionDirs = entries
        .filter((e) => e.isDirectory() &&
                       e.name !== "latest" &&
                       /^\d+\./.test(e.name))
        .map((e) => e.name)
        .sort(compareVersions);

    if (versionDirs.length === 0) {
        console.error("No version directories found");
        process.exit(1);
    }

    const mostRecent = versionDirs[versionDirs.length - 1];
    const oldVersions = versionDirs.slice(0, -1);

    console.log(`API doc directory: ${apiDocDir}`);
    console.log(`Most recent version: ${mostRecent}`);
    console.log(`Current version label: ${CURRENT_VERSION}`);
    console.log(`Old versions to process: ${oldVersions.join(", ")}`);
    console.log();

    // Process old versions: inject noindex + banner
    for (const version of oldVersions) {
        const dir = join(apiDocDir, version);
        const htmlFiles = await findHtmlFiles(dir);
        let modified = 0;
        for (const f of htmlFiles) {
            if (await injectIntoOldVersion(f, version)) {
                modified++;
            }
        }
        console.log(`  ${version}: ${modified}/${htmlFiles.length}` +
                     ` files modified`);
    }

    // Copy most recent to /latest/
    const latestDir = join(apiDocDir, "latest");
    console.log(`\nCopying ${mostRecent} -> latest/ ...`);

    try {
        await rm(latestDir, { recursive: true, force: true });
    } catch { /* ignore */ }

    await cp(join(apiDocDir, mostRecent), latestDir,
             { recursive: true });
    console.log(`  Copied ${mostRecent} to latest/`);

    // Inject canonical links into /latest/
    const latestHtml = await findHtmlFiles(latestDir);
    let modified = 0;
    for (const f of latestHtml) {
        if (await injectCanonical(f, latestDir)) {
            modified++;
        }
    }
    console.log(`  latest/: ${modified}/${latestHtml.length}` +
                ` files got canonical links`);

    console.log("\nDone!");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
