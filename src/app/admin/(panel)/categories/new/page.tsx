import CategoryForm from '../CategoryForm';

export const dynamic = 'force-dynamic';

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-[24px] font-extrabold uppercase tracking-tight2">
        Нова категорія
      </h1>
      <CategoryForm />
    </div>
  );
}
