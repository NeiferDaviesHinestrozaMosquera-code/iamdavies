// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://iamdavies.vercel.app',
  output: 'server',
  adapter: vercel(),
  image: {
    domains: ['qugowwsfwjdaxjbsdbfy.supabase.co'],
  }
});