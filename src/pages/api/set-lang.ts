import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const lang = formData.get('lang');

  if (lang === 'es' || lang === 'en') {
    cookies.set('lang', lang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      httpOnly: false,
    });
  }

  // Redirect back to the referring page or home
  const referer = request.headers.get('referer') || '/';
  return redirect(referer);
};
