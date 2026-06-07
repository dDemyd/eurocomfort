import { createAdminClient } from '@/lib/supabase/admin';
import { Button } from '@/components/admin/ui';
import LocalizedInput from '@/components/admin/LocalizedInput';
import { saveContentAction } from '@/lib/actions/content';

export const dynamic = 'force-dynamic';

/** Ключи, которые редактируются на странице (порядок = порядок секций). */
const KEYS = [
  { key: 'hero.title', label: 'Hero · Заголовок' },
  { key: 'hero.subtitle', label: 'Hero · Підзаголовок' },
  { key: 'why.title', label: 'WhyUs · Заголовок' },
  { key: 'why.lede', label: 'WhyUs · Опис' },
  { key: 'process.title', label: 'Process · Заголовок' },
  { key: 'process.lede', label: 'Process · Опис' },
  { key: 'reviews.lede', label: 'Reviews · Опис' },
  { key: 'lead.title', label: 'Lead · Заголовок' },
];

type Row = { key: string; value: { uk?: string; ru?: string } };

export default async function ContentPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('content_blocks')
    .select('key, value')
    .in(
      'key',
      KEYS.map((k) => k.key)
    );

  const byKey = new Map<string, Row['value']>(
    ((data ?? []) as Row[]).map((r) => [r.key, r.value ?? {}])
  );

  return (
    <div>
      <h1 className="mb-2 font-display text-[28px] font-extrabold uppercase tracking-tight2">
        Контент
      </h1>
      <p className="mb-6 text-[13px] text-ink-2">
        Тексти секцій лендинга. Залиште поле порожнім, щоб використати дефолтний переклад з messages/*.json.
      </p>

      <form action={saveContentAction} className="grid max-w-[760px] gap-6">
        {KEYS.map(({ key, label }) => (
          <div key={key} className="border border-hair-l bg-paper p-4">
            <input type="hidden" name="keys" value={key} />
            <LocalizedInput
              name={key}
              label={`${label}  ·  ${key}`}
              multiline={key.endsWith('.lede') || key.endsWith('.subtitle')}
              defaultValue={byKey.get(key) ?? null}
            />
          </div>
        ))}

        <div>
          <Button type="submit">Зберегти всі</Button>
        </div>
      </form>
    </div>
  );
}
