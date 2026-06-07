'use client';

import { useTransition } from 'react';
import { Button } from './ui';

export function PublishToggle({
  isPublished,
  onToggle,
}: {
  isPublished: boolean;
  onToggle: (next: boolean) => Promise<void>;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => onToggle(!isPublished))}
      aria-pressed={isPublished}
      className={`inline-flex h-7 min-w-[64px] items-center justify-center border px-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors disabled:opacity-50 ${
        isPublished
          ? 'border-brand bg-brand text-white'
          : 'border-hair-l bg-paper text-ink-2'
      }`}
    >
      {pending ? '…' : isPublished ? 'On' : 'Off'}
    </button>
  );
}

export function DeleteButton({
  onDelete,
  confirmText = 'Видалити цей запис?',
}: {
  onDelete: () => Promise<void>;
  confirmText?: string;
}) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmText)) return;
        start(() => onDelete());
      }}
      className="text-brand hover:bg-brand/10"
    >
      {pending ? '…' : 'Видалити'}
    </Button>
  );
}
