'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Button, Textarea } from '@/components/admin/ui';
import {
  saveCategoryContentState,
  type ContentFormState,
} from '@/lib/actions/categories';

const initialState: ContentFormState = { error: null };

export default function ContentForm({
  id,
  slug,
  initialContent,
  usingFallback,
}: {
  id: string;
  slug: string;
  initialContent: string;
  /** true, якщо в БД ще порожньо і показуємо JSON із файла-сіду */
  usingFallback: boolean;
}) {
  const [state, formAction, pending] = useActionState(saveCategoryContentState, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />

      {usingFallback && (
        <p className="rounded-md border border-hair-l bg-black/20 px-4 py-3 text-[13px] text-ink-2">
          У базі ще немає контенту для цієї категорії — показано вихідний JSON із
          файла. Збереження запише його в <code>categories.content</code>.
        </p>
      )}

      {state.error && (
        <p
          role="alert"
          className="rounded-md border border-brand/50 bg-brand/10 px-4 py-3 text-[13px] text-brand"
        >
          {state.error}
        </p>
      )}

      <Textarea
        name="content"
        defaultValue={initialContent}
        spellCheck={false}
        rows={32}
        className="font-mono text-[12px] leading-[1.6]"
      />

      <p className="text-[12px] text-ink-2">
        Структура — <code>CategoryContentSchema</code> (hero + sections[]). Кожен
        текст — пара <code>{'{ "uk": "…", "ru": "…" }'}</code>. JSON валідується
        перед збереженням.
      </p>

      <div className="mt-2 flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Збереження…' : 'Зберегти контент'}
        </Button>
        <Link href="/admin/categories">
          <Button type="button" variant="outline">
            Скасувати
          </Button>
        </Link>
      </div>
    </form>
  );
}
