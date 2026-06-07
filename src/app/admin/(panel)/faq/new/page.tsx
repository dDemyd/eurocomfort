import FaqForm from '../FaqForm';
export const dynamic = 'force-dynamic';
export default function NewFaqPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-[24px] font-extrabold uppercase tracking-tight2">
        Нове запитання
      </h1>
      <FaqForm />
    </div>
  );
}
