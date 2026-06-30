# node-opcua v2 Landing Page Rebuild

This directory contains version 2 of the `node-opcua` landing page, built using Astro. It is compiled and deployed to a hidden subdirectory `/v2/` of the live GitHub Pages site for testing and verification before cutover.

## Developer Quick Start

To run the development server locally:

```bash
cd v2
npm install
npm run dev
```

To build the static site locally:

```bash
npm run build
```

## Follow-ups / Out-of-Scope Roadmap

The following features were deferred from this initial rebuild phase and should be captured here for future implementation:

1. **Survival Guide Integration**: Future migration/integration of the Starlight-based OPC UA survival guide.
2. **High-Quality Customer Logos**: Replacing temporary/low-resolution/placeholder logo assets with high-quality SVG versions once provided.
3. **French Translations**: Support for French localization (`fr/` prefix) via Astro's i18n routing.
4. **Sponsors Recognition Page**: Dedicated page/section celebrating the sponsors and founding sponsors.
5. **Blog Migration**: Migrating the Jekyll blog posts under `/news/` into the Astro build system.
6. **TypeDoc Theme Integration**: Adapting TypeDoc design templates to match the new v2 visual identity.
7. **Analytics**: Re-integrating Google Analytics or other measurement systems once cutover from v1 is finalized.
