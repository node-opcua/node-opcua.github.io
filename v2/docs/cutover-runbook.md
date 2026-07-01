# v2 Cutover Runbook — Going Live Safely

**Purpose:** The step-by-step procedure to move the v2 site from the hidden `/v2/` staging path to the production root (`/`) of node-opcua.github.io, without losing SEO equity, breaking existing URLs, or deindexing the site.

**Gate:** This runbook executes ONLY AFTER the 2026-07-23 GSC verdict comes in GREEN (technical rankings stable, commercial rankings dropping on github.io, no collateral damage from the cannibalization audit). If the verdict is yellow or red, do NOT cut over — resolve the GSC issue first.

**Prerequisites (must all be true before starting):**
- Round 4 complete and approved, including the cutover-safety patch (env-conditional noindex + BASE_URL links)
- GSC week-4 verdict is green
- The /v2/ site has been reviewed live and signed off by Etienne
- You have a tested rollback plan (documented below)

**Estimated time:** 2-3 hours for the cutover itself, plus a 48-hour monitoring window after.

**Owner:** Etienne, with Antigravity executing the mechanical steps.

---

## Part 0 — Pre-cutover safety checks (do the day before)

Run through these the day BEFORE cutover so there are no surprises on the day.

- [ ] Confirm the cutover-safety patch is live: the noindex is env-conditional, not hardcoded
- [ ] Confirm all internal links use BASE_URL, not literal /v2/
- [ ] Take a full backup of the current github.io master branch state (git tag it: `pre-v2-cutover-2026-XX-XX`)
- [ ] Screenshot the current live homepage (so you have a visual record of what you're replacing)
- [ ] Pull the current GSC "top pages" and "top queries" reports and save them — this is your baseline to compare against after cutover
- [ ] Confirm the rollback procedure (Part 6) is understood and the git tag exists
- [ ] Verify /api_doc/ and /news/ (Jekyll) are untouched and will remain so — the cutover only replaces the landing page and adds new Astro pages

---

## Part 1 — Build the redirect map (data-driven, do this first)

This is the single most important SEO step. It preserves the backlink equity that makes node-opcua.github.io rank.

### 1.1 — Identify what needs redirecting

Pull from Google Search Console (not just GA):
- GSC → Performance → Pages → sort by clicks (last 6 months)
- Export the full list of URLs that receive organic search traffic

Categorize each URL:

| Category | Action |
|---|---|
| `/api_doc/**` | NO redirect — TypeDoc pipeline owns these, URLs unchanged |
| `/news/**` (Jekyll posts) | NO redirect — Jekyll blog stays, post URLs unchanged |
| `/` (homepage) | NO redirect — same path, new content renders (Astro takes over root) |
| Old Bootstrap pages with a v2 equivalent | 301/meta-refresh old → new path |
| Old Bootstrap pages with NO v2 equivalent | 301/meta-refresh to the closest relevant new page |
| Old Bootstrap pages that are dead/irrelevant | Let them 404, OR redirect to homepage if they have backlinks |

### 1.2 — The specific URLs to check

From the site analytics and the cannibalization audit, verify the disposition of:
- Any old landing-page sub-paths (e.g. `/index.html`, `/about`, `/features`, `/documentation`)
- Any commercial-product pages that the audit reduced (these may still have inbound links)
- The "permanent beta" post (already noindexed; confirm it's handled)

### 1.3 — GitHub Pages redirect mechanics

GitHub Pages does NOT support server-side 301 redirects. Options:

**Option A — Meta-refresh + canonical (the GitHub Pages standard):**
For each old URL that needs redirecting, create an HTML file at that path containing:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url=/new-path/">
  <link rel="canonical" href="https://node-opcua.github.io/new-path/">
  <meta name="robots" content="noindex">
</head>
<body>
  <p>This page has moved to <a href="/new-path/">/new-path/</a>.</p>
</body>
</html>
```

The `canonical` tag is what actually transfers SEO equity. The meta-refresh handles the user redirect. The noindex prevents the redirect stub itself from being indexed.

**Option B — Jekyll redirect plugin (if keeping any Jekyll):**
Since the Jekyll blog stays, you can use `jekyll-redirect-from` for `/news/`-adjacent redirects. But for the Astro-managed root, Option A is cleaner.

### 1.4 — Build the map as a file

Create `redirect-map.csv`:
```
old_path,new_path,reason,backlinks_estimate,done
```

Fill it from the GSC data. Every old URL with meaningful traffic or backlinks gets a row. This is the master list the cutover works from.

---

## Part 2 — Prepare the production build config

### 2.1 — Flip the base path

In `v2/astro.config.mjs`:
```javascript
// BEFORE (staging):
base: '/v2',

// AFTER (production):
base: '/',
```

Because internal links use `import.meta.env.BASE_URL` (from the cutover-safety patch), no link edits are needed. This one line is the structural cutover.

### 2.2 — Remove the staging noindex flag

The production deploy workflow must NOT set `PUBLIC_STAGING=true`. Because the noindex is now env-conditional (from the cutover-safety patch), simply not setting the flag makes the site indexable.

Double-check: build locally without the flag, inspect the HTML, confirm NO robots noindex meta tag is present.

### 2.3 — Add the sitemap

Install and configure `@astrojs/sitemap`:
```bash
cd v2 && npm install @astrojs/sitemap
```

In `astro.config.mjs`:
```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://node-opcua.github.io',
  base: '/',
  integrations: [sitemap()],
  // ...
});
```

The sitemap must include the new Astro pages (home, projects, commercial-use, news index). It must NOT conflict with the Jekyll-generated sitemap for /news/ posts — verify the two don't collide. If both generate a sitemap.xml at root, you need a sitemap index or a merge step.

### 2.4 — Production robots.txt

Replace the staging robots.txt (which disallowed /v2/) with a production one that ALLOWS indexing:

```
User-agent: *
Allow: /

Sitemap: https://node-opcua.github.io/sitemap.xml
```

Remove any `Disallow: /v2/` line — the /v2/ path won't exist after cutover.

---

## Part 3 — The cutover deploy

### 3.1 — Deploy order (critical)

The sequence matters to avoid a window where the site is broken or double-served:

1. Merge the `v2-rebuild` branch changes (base: '/', sitemap, prod robots) into the deploy pipeline
2. Deploy Astro output to the ROOT of the github.io master branch, NOT to /v2/
3. Ensure `keep_files: true` STILL preserves /api_doc/ and /news/ — the Astro root deploy must not wipe them
4. Deploy the redirect stub files (from Part 1) to their old paths
5. Verify the homepage renders the new Astro site at https://node-opcua.github.io/

### 3.2 — The keep_files danger (again)

This is the same danger as the original deploy. The Astro production deploy writes to root. With `keep_files: true`, it preserves /api_doc/ and /news/. WITHOUT it, the deploy wipes them.

TEST THIS AGAINST A FORK FIRST. Confirm that deploying Astro to root with keep_files preserves the api_doc and news directories. Do not test on the live repo.

### 3.3 — Remove or keep /v2/?

After cutover, the /v2/ path still exists (it was deployed there). Options:
- Leave it (harmless, but it's a duplicate of the live site — add noindex or delete)
- Delete the /v2/ directory from the master branch in a follow-up commit (cleaner)

Recommendation: delete /v2/ a few days after cutover, once you've confirmed the root site is stable. Don't do it same-day (keep the fallback).

---

## Part 4 — Immediate post-cutover verification (within 30 minutes)

Run through ALL of these immediately after the deploy:

- [ ] https://node-opcua.github.io/ renders the new Astro landing page
- [ ] View source: NO `noindex` meta tag present (the site is now indexable)
- [ ] All nav links work (Projects, News, GitHub, Sponsor, API reference)
- [ ] All three hero CTAs work (Get started → GitHub, For commercial use → /commercial-use/, Sustain → GitHub sponsors)
- [ ] /commercial-use/ renders correctly
- [ ] /projects/ renders correctly
- [ ] /news/ (the new Astro index) renders and its post links go to the Jekyll posts
- [ ] /api_doc/latest/ still works (TypeDoc untouched)
- [ ] A sample of old Jekyll post URLs still resolve (e.g. one from /news/2023/...)
- [ ] The redirect stubs work: visit 2-3 old URLs, confirm they redirect to new paths
- [ ] robots.txt at root allows indexing and references the sitemap
- [ ] sitemap.xml is reachable and contains the new pages
- [ ] Mobile: the site works on a phone (hamburger nav, responsive layout)
- [ ] Both light and dark mode render correctly

If ANY of these fail, consider rolling back (Part 6) rather than debugging live.

---

## Part 5 — Search Console actions (day of cutover)

- [ ] GSC → Sitemaps → submit the new sitemap.xml
- [ ] GSC → URL Inspection → inspect the homepage → Request Indexing
- [ ] GSC → URL Inspection → inspect /projects/, /commercial-use/, /news/ → Request Indexing for each
- [ ] For the top 5 old URLs that now redirect, use URL Inspection to confirm Google sees the redirect
- [ ] Note the date in your records — this is the cutover date, the anchor for post-cutover measurement

---

## Part 6 — Rollback plan (if something goes wrong)

If the cutover breaks something you can't fix in 15 minutes, roll back rather than debug live.

### 6.1 — The rollback

Because you tagged the pre-cutover state (`pre-v2-cutover-2026-XX-XX`):

```bash
git checkout master
git reset --hard pre-v2-cutover-2026-XX-XX
git push --force origin master
```

This restores the old Bootstrap site exactly as it was. GitHub Pages redeploys the old state within minutes.

### 6.2 — What rollback preserves

- The old homepage returns
- /api_doc/ and /news/ were never touched, so they're fine either way
- The /v2/ staging site is unaffected (it's a separate path)

### 6.3 — When to roll back vs. push forward

Roll back if:
- The homepage doesn't render or renders broken
- /api_doc/ or /news/ got wiped (the keep_files failure)
- Navigation is broken site-wide

Push forward (fix live) if:
- A single page has a minor visual bug
- A redirect stub is missing (add it)
- A non-critical link is wrong

The threshold: if the CORE site (homepage + api_doc + news) is broken, roll back. If it's a peripheral issue, fix forward.

---

## Part 7 — Post-cutover monitoring (first 4 weeks)

The cutover isn't "done" when the deploy succeeds. Monitor for 4 weeks.

### Week 1
- [ ] GSC → Coverage: confirm the new pages are being indexed
- [ ] GSC → confirm the homepage is still indexed (didn't accidentally deindex)
- [ ] Check that "node-opcua" search still returns the site at #1
- [ ] Watch for any spike in 404s (GSC → Coverage → Not found)

### Weeks 2-4
- [ ] Rankings for core technical terms ("node-opcua", "opc ua nodejs") stable or improving
- [ ] No drop in organic traffic vs. the pre-cutover baseline
- [ ] Redirect stubs are being followed (old URLs' equity transferring to new)
- [ ] The commercial-use page is doing its job (any referral traffic to sterfive.com?)

### Red flags requiring action
- "node-opcua" ranking drops → check noindex didn't survive, check for crawl errors
- Organic traffic drops >15% → check redirect map completeness, check for broken pages
- New pages not indexing → check sitemap, check robots.txt, request indexing manually

---

## Part 8 — Sterfive.com parallel workstream (separate, not blocking)

These are sterfive.com changes that complement the cutover but are NOT part of the github.io cutover and do NOT block it:

- [ ] Retarget sterfive.com pages to commercial modifiers ("node-opcua commercial support", "node-opcua SLA", "OPC UA consulting") so they don't compete with github.io for the bare term "node-opcua"
- [ ] Add a reciprocal link from sterfive.com back to node-opcua.github.io (the project home)
- [ ] Confirm sterfive.com's own sitemap and SEO health

This workstream can happen before, during, or after the github.io cutover. It's owned separately.

---

## Summary — the cutover in one page

1. **Gate:** GSC verdict green (2026-07-23)
2. **Prep:** redirect map from GSC data, backup/tag current state
3. **Config:** base '/v2' → '/', remove staging noindex flag, add sitemap, prod robots.txt
4. **Deploy:** Astro to root with keep_files:true (test on fork first), deploy redirect stubs
5. **Verify:** 30-minute checklist, roll back if core site broken
6. **GSC:** submit sitemap, request indexing, record cutover date
7. **Monitor:** 4 weeks, watch rankings and traffic

The two biggest risks, both now mitigated:
- Noindex surviving cutover → fixed by env-conditional flag (cutover-safety patch)
- Losing backlink equity → fixed by the redirect map (Part 1)

Everything else is mechanical. Test on a fork, keep the rollback tag, monitor for four weeks.

END OF CUTOVER RUNBOOK.
