import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ───────────── Button ─────────────
export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md';
  }
>(({ className, variant = 'default', size = 'md', ...props }, ref) => {
  const variants = {
    default:
      'bg-ink text-white border border-ink hover:bg-ink/90 disabled:opacity-50',
    outline:
      'bg-transparent text-ink border border-hair-l hover:bg-ash disabled:opacity-50',
    ghost:
      'bg-transparent text-ink hover:bg-ash disabled:opacity-50',
    destructive:
      'bg-brand text-white border border-brand hover:bg-brand-dk disabled:opacity-50',
  };
  const sizes = {
    sm: 'h-8 px-3 text-[12px]',
    md: 'h-10 px-4 text-[13px]',
  };
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = 'Button';

// ───────────── Input ─────────────
export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'h-10 w-full border border-hair-l bg-paper px-3 text-[14px] text-ink outline-none focus:border-ink',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

// ───────────── Textarea ─────────────
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'min-h-[120px] w-full border border-hair-l bg-paper p-3 text-[14px] text-ink outline-none focus:border-ink',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

// ───────────── Label ─────────────
export function Label({
  children,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        'block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2 mb-1.5',
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}

// ───────────── Switch (контролируется hidden input для server actions) ─────────────
export function Switch({
  name,
  defaultChecked,
  label,
}: {
  name: string;
  defaultChecked?: boolean;
  label?: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 select-none">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="block h-5 w-9 border border-hair-l bg-ash relative transition-colors peer-checked:bg-brand peer-checked:border-brand"
      >
        <span className="absolute top-[1px] left-[1px] block h-[16px] w-[16px] bg-paper transition-transform peer-checked:translate-x-[16px]" />
      </span>
      {label ? <span className="text-[13px] text-ink">{label}</span> : null}
    </label>
  );
}

// ───────────── Field wrapper ─────────────
export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="mt-1 text-[11px] text-ink-2">{hint}</p> : null}
      {error ? <p className="mt-1 text-[11px] text-brand">{error}</p> : null}
    </div>
  );
}

// ───────────── Table ─────────────
export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-hair-l overflow-x-auto">
      <table className="w-full text-[13px]">{children}</table>
    </div>
  );
}
export function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        'border-b border-hair-l bg-ash px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-ink-2',
        className
      )}
    >
      {children}
    </th>
  );
}
export function Td({
  children,
  className,
  colSpan,
}: {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn('border-b border-hair-l px-3 py-2 align-middle', className)}
    >
      {children}
    </td>
  );
}
