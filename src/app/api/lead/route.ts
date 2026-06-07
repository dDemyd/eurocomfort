import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendTelegram } from '@/lib/tg';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.phone) {
    return NextResponse.json({ error: 'phone required' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('leads').insert({
    name: body.name ?? null,
    phone: body.phone,
    comment: body.comment ?? null,
    locale: body.locale ?? null,
    page: body.page ?? null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await sendTelegram(
    `<b>Нова заявка</b>\nТел: ${body.phone}\nІм'я: ${body.name ?? '—'}`
  );

  return NextResponse.json({ ok: true });
}
