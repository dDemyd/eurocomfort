import 'server-only';

export async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('[telegram] skipped: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    return { skipped: true } as const;
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('[telegram] failed', res.status, detail);
    return { ok: false as const, status: res.status };
  }

  return { ok: true as const };
}
