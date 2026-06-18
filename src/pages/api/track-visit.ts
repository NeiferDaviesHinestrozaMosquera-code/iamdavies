import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

/**
 * POST /api/track-visit
 * Records a page visit silently. Called server-side from the middleware,
 * never exposed to the frontend user.
 *
 * Body: { page: string }
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const page = body.page?.trim();

    if (!page) {
      return new Response(JSON.stringify({ error: 'Missing page' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract visitor metadata
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    const userAgent = request.headers.get('user-agent') ?? '';
    const referer = request.headers.get('referer') ?? '';

    const { error } = await supabase.from('page_visits').insert({
      page,
      ip_address: ip,
      user_agent: userAgent,
      referer,
    });

    if (error) {
      console.error('Error tracking visit:', error.message);
      return new Response(JSON.stringify({ error: 'DB error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
