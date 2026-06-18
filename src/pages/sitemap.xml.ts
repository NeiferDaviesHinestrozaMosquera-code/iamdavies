import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = (site ? site.toString() : 'https://iamdavies.com').replace(/\/$/, '');
  
  // 1. Define static routes
  const staticPages = ['', 'about', 'projects', 'contact', 'blog'];
  
  // 2. Fetch dynamic blog posts
  const { data: posts = [] } = await supabase
    .from('blog_posts')
    .select('slug, created_at')
    .eq('status', 'published');

  // 3. Build XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static routes
  for (const page of staticPages) {
    const pageUrl = page ? `${siteUrl}/${page}` : siteUrl;
    xml += `  <url>\n`;
    xml += `    <loc>${pageUrl}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Add blog posts
  if (posts) {
    for (const post of posts) {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const lastmod = post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${postUrl}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    }
  }

  xml += '</urlset>';

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
