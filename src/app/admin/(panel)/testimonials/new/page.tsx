import TestimonialForm from '../TestimonialForm';

export const dynamic = 'force-dynamic';

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-[24px] font-extrabold uppercase tracking-tight2">
        Новий відгук
      </h1>
      <TestimonialForm />
    </div>
  );
}
