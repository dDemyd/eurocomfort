// Общая валидация формы заявки. Используется и на клиенте (LeadForm),
// и на сервере (api/lead/route.ts), чтобы правила не расходились.

export type LeadInput = {
  name?: string;
  phone?: string;
  comment?: string;
  type?: string;
  area?: string;
  stage?: string;
  city?: string;
  segment?: string;
  locale?: string;
  page?: string;
};

export type FieldErrorCode =
  | 'phoneRequired'
  | 'phoneInvalid'
  | 'nameRequired'
  | 'nameTooLong'
  | 'typeRequired'
  | 'areaRequired'
  | 'stageRequired'
  | 'cityRequired'
  | 'cityTooLong'
  | 'segmentRequired'
  | 'messageTooLong';

export type FieldErrors = Partial<Record<keyof LeadInput, FieldErrorCode>>;

const LIMITS = {
  name: 120,
  phone: 32,
  comment: 2000,
  city: 120,
};

/** Цифры из строки. Пример: "+380 (97) 969 04 03" → "380979690403" */
export function digitsOnly(s: string): string {
  return (s || '').replace(/\D+/g, '');
}

/** Минимальный валидатор номера: 9..15 цифр (по E.164 без plus). */
export function isValidPhone(raw: string): boolean {
  const d = digitsOnly(raw);
  return d.length >= 9 && d.length <= 15;
}

/** Нормализация в E.164. UA-номер 9XXXXXXXX → +380 9XXXXXXXX. */
export function normalizePhone(raw: string): string {
  const d = digitsOnly(raw);
  if (!d) return '';
  // 0 67 XXX XX XX → 380 67 ...
  if (d.length === 10 && d.startsWith('0')) return `+38${d}`;
  // 380 67 ... → +380 ...
  if (d.startsWith('380')) return `+${d}`;
  // уже с кодом страны без 380
  return `+${d}`;
}

/** Поля, обязательные к заполнению. Кроме них `comment` остаётся опциональным. */
export const REQUIRED_FIELDS = [
  'name',
  'phone',
  'type',
  'area',
  'stage',
  'city',
  'segment',
] as const;

export function validateLead(input: LeadInput): FieldErrors {
  const errors: FieldErrors = {};

  const name = (input.name ?? '').trim();
  if (!name) errors.name = 'nameRequired';
  else if (name.length > LIMITS.name) errors.name = 'nameTooLong';

  const phone = (input.phone ?? '').trim();
  if (!phone) errors.phone = 'phoneRequired';
  else if (!isValidPhone(phone)) errors.phone = 'phoneInvalid';

  if (!(input.type ?? '').trim()) errors.type = 'typeRequired';
  if (!(input.area ?? '').trim()) errors.area = 'areaRequired';
  if (!(input.stage ?? '').trim()) errors.stage = 'stageRequired';
  if (!(input.segment ?? '').trim()) errors.segment = 'segmentRequired';

  const city = (input.city ?? '').trim();
  if (!city) errors.city = 'cityRequired';
  else if (city.length > LIMITS.city) errors.city = 'cityTooLong';

  if ((input.comment ?? '').length > LIMITS.comment) {
    errors.comment = 'messageTooLong';
  }

  return errors;
}

/** Прогрессивная маска ввода для украинского формата: +380 (97) 969 04 03. */
export function formatPhoneInput(raw: string): string {
  let d = digitsOnly(raw);
  // если начинается с 0 — считаем как локальный, отбрасываем 0 в начале
  if (d.startsWith('0')) d = d.slice(1);
  // если уже начинается с 380 — убираем чтобы переподставить
  if (d.startsWith('380')) d = d.slice(3);
  d = d.slice(0, 10); // максимум 10 значащих цифр после +380
  const parts: string[] = ['+380'];
  if (d.length > 0) parts.push(` (${d.slice(0, 2)}`);
  if (d.length >= 2) parts[1] += ')';
  if (d.length > 2) parts.push(` ${d.slice(2, 5)}`);
  if (d.length > 5) parts.push(` ${d.slice(5, 7)}`);
  if (d.length > 7) parts.push(` ${d.slice(7, 9)}`);
  return parts.join('');
}
