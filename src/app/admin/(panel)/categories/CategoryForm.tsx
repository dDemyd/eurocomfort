import Link from 'next/link';
import { Button, Field, Input, Switch } from '@/components/admin/ui';
import LocalizedInput from '@/components/admin/LocalizedInput';
import { saveCategoryAction } from '@/lib/actions/categories';

type Cat = {
  id: string;
  slug: string;
  title: Record<string, string>;
  image: string | null;
  sort: number;
  is_published: boolean;
};

export default function CategoryForm({ row }: { row?: Cat | null }) {
  const id = row?.id ?? null;

  async function action(fd: FormData) {
    'use server';
    await saveCategoryAction(id, fd);
  }

  return (
    <form action={action} className="grid max-w-[640px] grid-cols-1 gap-4">
      <Field label="Slug (URL)" htmlFor="slug">
        <Input
          id="slug"
          name="slug"
          required
          defaultValue={row?.slug ?? ''}
          placeholder="panoramne-sklinnia"
        />
      </Field>

      <LocalizedInput
        name="title"
        label="Заголовок"
        required
        defaultValue={row?.title ?? null}
      />

      <Field label="Зображення (шлях у Storage або URL)" htmlFor="image">
        <Input id="image" name="image" defaultValue={row?.image ?? ''} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Порядок" htmlFor="sort">
          <Input
            id="sort"
            name="sort"
            type="number"
            defaultValue={row?.sort ?? 0}
          />
        </Field>
        <Field label="Публікація" htmlFor="is_published">
          <Switch
            name="is_published"
            defaultChecked={row?.is_published ?? true}
            label="Опубліковано"
          />
        </Field>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Button type="submit">{id ? 'Зберегти' : 'Створити'}</Button>
        <Link href="/admin/categories">
          <Button type="button" variant="outline">
            Скасувати
          </Button>
        </Link>
        {id && (
          <Link href={`/admin/categories/${id}/content`} className="ml-auto">
            <Button type="button" variant="outline">
              Контент сторінки →
            </Button>
          </Link>
        )}
      </div>
    </form>
  );
}
