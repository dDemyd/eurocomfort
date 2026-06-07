'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button, Field, Input } from '@/components/admin/ui';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') || '').trim();
    const password = String(fd.get('password') || '');

    if (!email || !password) {
      setError('Вкажіть e-mail та пароль');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(
        signInError.message === 'Invalid login credentials'
          ? 'Невірний e-mail або пароль'
          : signInError.message
      );
      setLoading(false);
      return;
    }

    // refresh — server layout заново выполнит guard и пропустит
    router.refresh();
    router.push('/admin');
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Field label="E-mail" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
        />
      </Field>
      <Field label="Пароль" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>
      {error ? (
        <p
          role="alert"
          className="border border-brand bg-brand/5 p-2 text-[12px] text-brand"
        >
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={loading} className="w-full justify-center">
        {loading ? 'Вхід…' : 'Увійти'}
      </Button>
    </form>
  );
}
