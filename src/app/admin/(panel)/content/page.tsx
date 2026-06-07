import { createAdminClient } from '@/lib/supabase/admin';
import { Button } from '@/components/admin/ui';
import LocalizedInput from '@/components/admin/LocalizedInput';
import { saveContentAction } from '@/lib/actions/content';

export const dynamic = 'force-dynamic';

/** Ключи, которые редактируются на странице (порядок = порядок секций). */
const KEYS = [
  { key: 'hero.title', label: 'Hero · Заголовок' },
  { key: 'hero.subtitle', label: 'Hero · Підзаголовок' },
  { key: 'catalog.title', label: 'Каталог · Заголовок' },
  { key: 'catalog.lede', label: 'Каталог · Опис' },
  { key: 'why.title', label: 'WhyUs · Заголовок' },
  { key: 'why.lede', label: 'WhyUs · Опис' },
  { key: 'process.title', label: 'Process · Заголовок' },
  { key: 'process.lede', label: 'Process · Опис' },
  { key: 'projects.title', label: 'Projects · Заголовок' },
  { key: 'reviews.title', label: 'Reviews · Заголовок' },
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
      <div className="mb-6 max-w-[760px] text-[13px] text-ink-2">
        <p>
          Тексти секцій лендинга. Залиште поле порожнім, щоб використати дефолтний переклад з{' '}
          <code className="font-mono">messages/*.json</code>.
        </p>
        <p className="mt-2">
          У заголовках можна позначати фрагмент брендовим червоним кольором тегом{' '}
          <code className="font-mono text-ink">&lt;red&gt;текст&lt;/red&gt;</code> і
          переносити рядок тегом <code className="font-mono text-ink">&lt;br&gt;</code>.
          Інші HTML-теги ігноруються.
        </p>
        <p className="mt-1 text-ink-2">
          Приклад: <code className="font-mono">Понад &lt;red&gt;10 000 м²&lt;/red&gt;&lt;br&gt;засклених обʼєктів</code>
        </p>
      </div>

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
