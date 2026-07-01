import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://node-opcua.github.io',
  base: '/v2',
  output: 'static',
  trailingSlash: 'never',
  build: {
    assets: 'assets',
    format: 'file',
  },
  integrations: [
    sitemap({
      filter: (page) => {
        // Exclude feed.xml and redirect stubs from sitemap
        return !page.includes('feed.xml');
      },
      serialize(item) {
        // Ensure sitemap URLs match the canonical .html URLs
        const u = new URL(item.url);
        if (u.pathname !== '/' && !u.pathname.endsWith('.html') && !u.pathname.endsWith('/')) {
          u.pathname += '.html';
          item.url = u.toString();
        }
        return item;
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    fallback: {},
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
