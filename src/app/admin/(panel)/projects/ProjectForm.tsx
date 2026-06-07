import Link from 'next/link';
import { Button, Field, Input, Switch } from '@/components/admin/ui';
import LocalizedInput from '@/components/admin/LocalizedInput';
import ImagesField from '@/components/admin/ImagesField';
import { saveProjectAction } from '@/lib/actions/projects';

type Cat = { id: string; title: Record<string, string> };

type Row = {
  id: string;
  slug: string | null;
  title: Record<string, string>;
  location: Record<string, string>;
  system: Record<string, string>;
  description: Record<string, string>;
  category_id: string | null;
  cover: string | null;
  images: string[];
  sort: number;
  is_published: boolean;
};

export default function ProjectForm({
  row,
  categories,
}: {
  row?: Row | null;
  categories: Cat[];
}) {
  const id = row?.id ?? null;

  async function action(fd: FormData) {
    'use server';
    await saveProjectAction(id, fd);
  }

  return (
    <form action={action} className="grid max-w-[820px] grid-cols-1 gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Slug (URL, опціонально)" htmlFor="slug">
          <Input id="slug" name="slug" defaultValue={row?.slug ?? ''} />
        </Field>
        <Field label="Категорія" htmlFor="category_id">
          <select
            id="category_id"
            name="category_id"
            defaultValue={row?.category_id ?? ''}
            className="h-10 w-full border border-hair-l bg-paper px-3 text-[14px] text-ink outline-none focus:border-ink"
          >
            <option value="">— без категорії —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title?.uk ?? c.id}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <LocalizedInput
        name="title"
        label="Назва (м. Біла Церква, …)"
        required
        defaultValue={row?.title ?? null}
      />
      <LocalizedInput
        name="location"
        label="Локація"
        defaultValue={row?.location ?? null}
      />
      <LocalizedInput
        name="system"
        label="Система (Sliding Smart …)"
        defaultValue={row?.system ?? null}
      />
      <LocalizedInput
        name="description"
        label="Опис"
        multiline
        rows={4}
        defaultValue={row?.description ?? null}
      />

      <ImagesField
        initialImages={row?.images ?? []}
        initialCover={row?.cover ?? null}
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
        <Link href="/admin/projects">
          <Button type="button" variant="outline">Скасувати</Button>
        </Link>
      </div>
    </form>
  );
}
