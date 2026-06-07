import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendTelegram } from '@/lib/tg';
import { sendResendEmail } from '@/lib/resend';
import {
  normalizePhone,
  validateLead,
  type LeadInput,
} from '@/lib/leadValidation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY = 16_000; // байт — защита от мусора
const SAFE_PAGE = (s: unknown) => {
  if (typeof s !== 'string') return null;
  // не пропускаем никаких PII из произвольной строки: оставляем только path
  try {
    const u = new URL(s, 'https://x.local');
    return u.pathname.slice(0, 200);
  } catch {
    return s.slice(0, 200);
  }
};

const trim = (v: unknown, max = 500) =>
  typeof v === 'string' ? v.trim().slice(0, max) : undefined;

function buildComment(input: LeadInput): string | null {
  const meta: string[] = [];
  if (input.type) meta.push(`Тип: ${input.type}`);
  if (input.area) meta.push(`Площа: ${input.area}`);
  if (input.stage) meta.push(`Стадія: ${input.stage}`);
  if (input.city) meta.push(`Місто: ${input.city}`);
  if (input.segment) meta.push(`Сегмент: ${input.segment}`);
  const body = (input.comment ?? '').trim();
  const parts = [meta.join(' · '), body].filter(Boolean);
  const joined = parts.join('\n\n').slice(0, 4000);
  return joined ? joined : null;
}

export async function POST(req: Request) {
  // Проверяем content-length и сам body
  const raw = await req.text().catch(() => '');
  if (!raw || raw.length > MAX_BODY) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 });
  }

  const input: LeadInput = {
    name: trim(body.name, 120),
    phone: trim(body.phone, 32),
    comment: trim(body.comment ?? body.message, 2000),
    type: trim(body.type, 80),
    area: trim(body.area, 80),
    stage: trim(body.stage, 80),
    city: trim(body.city, 120),
    segment: trim(body.segment, 80),
    locale: trim(body.locale, 8),
    page: SAFE_PAGE(body.page) ?? undefined,
  };

  const fieldErrors = validateLead(input);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { ok: false, fieldErrors },
      { status: 422 }
    );
  }

  const phone = normalizePhone(input.phone!);
  const comment = buildComment(input);

  // Запись через service-role — у клиента нет policy на insert в leads.
  const supabase = createAdminClient();
  const { error: dbError, data: dbRow } = await supabase
    .from('leads')
    .insert({
      name: input.name ?? null,
      phone,
      comment,
      locale: input.locale ?? null,
      page: input.page ?? null,
    })
    .select('id')
    .single();

  if (dbError) {
    console.error('[lead] db insert failed', dbError);
    return NextResponse.json(
      { ok: false, error: 'storage_failed' },
      { status: 500 }
    );
  }

  // Уведомления — параллельно, не валим запрос если что-то отвалилось.
  const lines = [
    `<b>Нова заявка</b>`,
    `Тел: ${phone}`,
    `Імʼя: ${input.name || '—'}`,
    input.city ? `Місто: ${input.city}` : null,
    input.type ? `Тип: ${input.type}` : null,
    input.area ? `Площа: ${input.area}` : null,
    input.stage ? `Стадія: ${input.stage}` : null,
    input.segment ? `Сегмент: ${input.segment}` : null,
    input.comment ? `\nКоментар:\n${input.comment}` : null,
    input.locale ? `Мова: ${input.locale}` : null,
  ].filter(Boolean);
  const tgText = lines.join('\n');

  const emailText =
    `Новая заявка с сайта\n\n` +
    `Телефон: ${phone}\n` +
    `Имя: ${input.name || '—'}\n` +
    (input.city ? `Город: ${input.city}\n` : '') +
    (input.type ? `Тип объекта: ${input.type}\n` : '') +
    (input.area ? `Площадь: ${input.area}\n` : '') +
    (input.stage ? `Стадия: ${input.stage}\n` : '') +
    (input.segment ? `Сегмент: ${input.segment}\n` : '') +
    (input.comment ? `\nКомментарий:\n${input.comment}\n` : '') +
    (input.locale ? `Язык: ${input.locale}\n` : '');

  await Promise.allSettled([
    sendTelegram(tgText),
    sendResendEmail({
      subject: `Заявка с сайта · ${phone}`,
      text: emailText,
    }),
  ]);

  return NextResponse.json({ ok: true, id: dbRow?.id ?? null });
}
