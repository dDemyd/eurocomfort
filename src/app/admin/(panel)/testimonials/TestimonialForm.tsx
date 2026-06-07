import Link from 'next/link';
import { Button, Field, Input, Switch } from '@/components/admin/ui';
import LocalizedInput from '@/components/admin/LocalizedInput';
import { saveTestimonialAction } from '@/lib/actions/testimonials';

type Row = {
  id: string;
  author: string;
  body: Record<string, string>;
  sort: number;
  is_published: boolean;
};

export default function TestimonialForm({ row }: { row?: Row | null }) {
  const id = row?.id ?? null;
  async function action(fd: FormData) {
    'use server';
    await saveTestimonialAction(id, fd);
  }
  return (
    <form action={action} className="grid max-w-[720px] grid-cols-1 gap-4">
      <Field label="Автор" htmlFor="author">
        <Input id="author" name="author" required defaultValue={row?.author ?? ''} />
      </Field>
      <LocalizedInput
        name="body"
        label="Текст відгуку"
        multiline
        rows={5}
        required
        defaultValue={row?.body ?? null}
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
        <Link href="/admin/testimonials">
          <Button type="button" variant="outline">Скасувати</Button>
        </Link>
      </div>
    </form>
  );
}
