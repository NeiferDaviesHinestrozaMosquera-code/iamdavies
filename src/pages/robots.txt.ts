import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site || 'https://iamdavies.vercel.app';
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${new URL('sitemap.xml', siteUrl).href}
`;

  return new Response(robots, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
