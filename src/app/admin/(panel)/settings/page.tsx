import { createAdminClient } from '@/lib/supabase/admin';
import { Button, Field, Input } from '@/components/admin/ui';
import { saveSettingsAction } from '@/lib/actions/settings';

export const dynamic = 'force-dynamic';

const KEYS = [
  { key: 'contact.phone_display', label: 'Телефон (як показувати)', placeholder: '+380 (97) 969 04 03' },
  { key: 'contact.phone_href', label: 'Телефон (tel:href)', placeholder: 'tel:+380979690403' },
  { key: 'contact.email', label: 'E-mail', placeholder: 'eurocomfortbc@gmail.com' },
  { key: 'contact.address', label: 'Адреса', placeholder: 'м. Біла Церква, вул. Ярмаркова, 39' },
  { key: 'contact.schedule', label: 'Графік', placeholder: 'Пн–Пт 09:00–19:00' },
  { key: 'social.instagram', label: 'Instagram', placeholder: 'https://instagram.com/…' },
  { key: 'social.facebook', label: 'Facebook', placeholder: 'https://facebook.com/…' },
  { key: 'social.telegram', label: 'Telegram', placeholder: 'https://t.me/…' },
];

type Row = { key: string; value: { v?: string } };

export default async function SettingsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', KEYS.map((k) => k.key));

  const byKey = new Map<string, string>(
    ((data ?? []) as Row[]).map((r) => [r.key, r.value?.v ?? ''])
  );

  return (
    <div>
      <h1 className="mb-2 font-display text-[28px] font-extrabold uppercase tracking-tight2">
        Налаштування
      </h1>
      <p className="mb-6 text-[13px] text-ink-2">
        Глобальні контакти та посилання на соцмережі. Підтягуються в шапку, форму і футер.
      </p>
      <form action={saveSettingsAction} className="grid max-w-[640px] gap-4">
        {KEYS.map(({ key, label, placeholder }) => (
          <Field key={key} label={label}>
            <Input
              name={`set:${key}`}
              defaultValue={byKey.get(key) ?? ''}
              placeholder={placeholder}
            />
          </Field>
        ))}
        <div>
          <Button type="submit">Зберегти</Button>
        </div>
      </form>
    </div>
  );
}
