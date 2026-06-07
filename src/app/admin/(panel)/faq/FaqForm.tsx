import Link from 'next/link';
import { Button, Field, Input, Switch } from '@/components/admin/ui';
import LocalizedInput from '@/components/admin/LocalizedInput';
import { saveFaqAction } from '@/lib/actions/faq';

type Row = {
  id: string;
  question: Record<string, string>;
  answer: Record<string, string>;
  sort: number;
  is_published: boolean;
};

export default function FaqForm({ row }: { row?: Row | null }) {
  const id = row?.id ?? null;
  async function action(fd: FormData) {
    'use server';
    await saveFaqAction(id, fd);
  }
  return (
    <form action={action} className="grid max-w-[760px] grid-cols-1 gap-4">
      <LocalizedInput
        name="question"
        label="Запитання"
        required
        defaultValue={row?.question ?? null}
      />
      <LocalizedInput
        name="answer"
        label="Відповідь"
        multiline
        rows={6}
        required
        defaultValue={row?.answer ?? null}
      />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Порядок" htmlFor="sort">
          <Input id="sort" name="sort" type="number" defaultValue={row?.sort ?? 0} />
        </Field>
        <Field label="Публікація" htmlFor="is_published">
          <Switch
            name="is_published"
            defaultChecked={row?.is_published ?? true}
            label="Опубліковано"
          />
        </Field>
      </div>
      <div className="mt-2 flex gap-3">
        <Button type="submit">{id ? 'Зберегти' : 'Створити'}</Button>
        <Link href="/admin/faq">
          <Button type="button" variant="outline">Скасувати</Button>
        </Link>
      </div>
    </form>
  );
}
