import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

// ✅ Sanitiza inputs para prevenir XSS en el HTML del email
const sanitize = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

// ✅ Rate limiting en memoria (simple, sin dependencias externas)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;         // máximo de requests
const RATE_WINDOW_MS = 60000; // por minuto

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT) return true;

  record.count++;
  return false;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // ✅ Rate limiting por IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();

    // ✅ Trim para evitar que espacios en blanco pasen como valores válidos
    const name = body.name?.trim() ?? '';
    const email = body.email?.trim() ?? '';
    const subject = body.subject?.trim() ?? '';
    const message = body.message?.trim() ?? '';

    // ✅ Validación de campos obligatorios
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Por favor completa los campos obligatorios.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ✅ Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'El formato del email no es válido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ✅ Validación de longitud máxima
    if (name.length > 100) {
      return new Response(
        JSON.stringify({ error: 'El nombre no puede superar los 100 caracteres.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (email.length > 200) {
      return new Response(
        JSON.stringify({ error: 'El email no puede superar los 200 caracteres.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (subject.length > 200) {
      return new Response(
        JSON.stringify({ error: 'El asunto no puede superar los 200 caracteres.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (message.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'El mensaje no puede superar los 5000 caracteres.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. ✅ Insert to Supabase DB
    const { error: dbError } = await supabase.from('messages').insert({
      name,
      email,
      subject: subject || 'Sin asunto',
      message,
      is_read: false,
    });

    if (dbError) throw dbError;

    // 2. ✅ Send email using Resend con inputs sanitizados
    const resendApiKey = import.meta.env.RESEND_API_KEY;

    if (resendApiKey) {
      const sName = sanitize(name);
      const sEmail = sanitize(email);
      const sSubject = sanitize(subject || 'Sin asunto');
      const sMessage = sanitize(message);

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: 'neiferdaviesmosq@gmail.com',
          subject: `Nuevo contacto: ${subject || 'Oferta de empleo <3'}`,
          html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo mensaje</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:13px;color:rgba(255,255,255,0.75);letter-spacing:2px;text-transform:uppercase;font-weight:600;">Portafolio</p>
              <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;">✉️ Nuevo Mensaje</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;">
              <p style="margin:0 0 28px 0;font-size:15px;color:#71717a;">Recibiste un nuevo mensaje desde tu formulario de contacto.</p>

              <!-- Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding-bottom:16px;">
                    <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;color:#a1a1aa;text-transform:uppercase;letter-spacing:1px;">Nombre</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#18181b;">${sName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #f4f4f5;padding:16px 0;">
                    <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;color:#a1a1aa;text-transform:uppercase;letter-spacing:1px;">Email</p>
                    <a href="mailto:${sEmail}" style="margin:0;font-size:16px;font-weight:600;color:#6366f1;text-decoration:none;">${sEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #f4f4f5;padding-top:16px;">
                    <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;color:#a1a1aa;text-transform:uppercase;letter-spacing:1px;">Asunto</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#18181b;">${sSubject}</p>
                  </td>
                </tr>
              </table>

              <!-- Mensaje -->
              <p style="margin:0 0 10px 0;font-size:11px;font-weight:700;color:#a1a1aa;text-transform:uppercase;letter-spacing:1px;">Mensaje</p>
              <div style="background:#fafafa;border:1px solid #e4e4e7;border-left:4px solid #6366f1;border-radius:8px;padding:20px 24px;">
                <p style="margin:0;font-size:15px;line-height:1.75;color:#3f3f46;white-space:pre-wrap;">${sMessage}</p>
              </div>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${sEmail}?subject=${encodeURIComponent('Re: ' + (subject || 'Tu mensaje'))}"
                       style="display:inline-block;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;">
                      Responder →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;border-top:1px solid #e4e4e7;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;">Enviado desde el formulario de contacto de tu portafolio.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
        }),
      });

      if (!emailResponse.ok) {
        // ✅ Resend falló pero el mensaje ya está en DB — no es crítico
        const errText = await emailResponse.text();
        console.error('Resend falló — mensaje guardado en DB de todas formas:', errText);
      }
    } else {
      console.warn('RESEND_API_KEY no configurado en variables de entorno.');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err: unknown) {
    // ✅ Tipado correcto — err puede no ser un Error estándar
    const message =
      err instanceof Error ? err.message : 'Error interno del servidor.';
    console.error('Error en API de contacto:', err);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};