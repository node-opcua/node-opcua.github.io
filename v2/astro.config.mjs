import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://node-opcua.github.io',
  base: '/v2',
  output: 'static',
  trailingSlash: 'always',
  build: {
    assets: 'assets',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    fallback: {},
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
