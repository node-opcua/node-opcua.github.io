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
    sitemap(),
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
