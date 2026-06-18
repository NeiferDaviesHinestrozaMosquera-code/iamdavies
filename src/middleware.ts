import { defineMiddleware } from "astro:middleware";
import { supabase } from "./lib/supabase";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, redirect, cookies, request } = context;
  const pathname = url.pathname;
  
  const isAdminPage = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/';
  const isMaintenancePage = pathname === '/maintenance';
  const isApiRoute = pathname.startsWith('/api/');
  const isInternalRoute = pathname.startsWith('/_');

  // Session guard for admin pages
  if (isAdminPage && !isLoginPage) {
    const accessToken = cookies.get('sb-access-token')?.value;
    const refreshToken = cookies.get('sb-refresh-token')?.value;

    if (!accessToken || !refreshToken) {
      return redirect('/admin/login');
    }

    // Validate the access token directly against Supabase (no setSession needed)
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      cookies.delete('sb-access-token', { path: '/' });
      cookies.delete('sb-refresh-token', { path: '/' });
      return redirect('/admin/login');
    }
  }

  // Only check maintenance mode for public facing pages (exclude API, static assets, etc.)
  if (!isAdminPage && !isMaintenancePage && !isApiRoute && !isInternalRoute) {
    const { data: settings } = await supabase
      .from('site_settings')
      .select('maintenance_mode')
      .single();
      
    if (settings?.maintenance_mode) {
      return redirect('/maintenance');
    }
  }

  // ── Invisible Visit Tracking ──
  // Track visits on public pages only (not admin, not API, not internal routes)
  // Fire-and-forget: do NOT await — never slow down page rendering
  if (!isAdminPage && !isApiRoute && !isInternalRoute && !isMaintenancePage) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    const userAgent = request.headers.get('user-agent') ?? '';
    const referer = request.headers.get('referer') ?? '';

    // Fire-and-forget insert — errors are silently logged, never block the response
    supabase.from('page_visits').insert({
      page: pathname,
      ip_address: ip,
      user_agent: userAgent,
      referer,
    }).then(({ error }) => {
      if (error) console.error('[visit-tracker] Insert failed:', error.message);
    });
  }

  return next();
});
