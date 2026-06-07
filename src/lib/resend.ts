import 'server-only';

/**
 * Минимальный клиент Resend без зависимости от SDK.
 * Использует REST endpoint. Если переменные не заданы — функция тихо выходит,
 * чтобы dev/staging не падал без настроенного Resend.
 */
export async function sendResendEmail({
  subject,
  text,
  html,
}: {
  subject: string;
  text: string;
  html?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.RESEND_TO;
  if (!apiKey || !from || !to) return { skipped: true } as const;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: to.split(',').map((s) => s.trim()).filter(Boolean),
      subject,
      text,
      html: html ?? text.replace(/\n/g, '<br>'),
    }),
  });

  if (!res.ok) {
    // Не бросаем — для лида важнее, что заявка сохранена. Просто логируем.
    const detail = await res.text().catch(() => '');
    console.error('[resend] failed', res.status, detail);
    return { ok: false as const, status: res.status };
  }
  return { ok: true as const };
}
