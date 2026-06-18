// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://iamdavies.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
});
