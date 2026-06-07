'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Reveal from '../Reveal';
import RichText from '../RichText';
import type { LocalizedRecord } from '@/lib/queries';
import {
  formatPhoneInput,
  validateLead,
  type FieldErrorCode,
  type FieldErrors,
  type LeadInput,
} from '@/lib/leadValidation';

type Contact = { k: string; v: string };
type Status = 'idle' | 'loading' | 'success' | 'error';

const Chev = () => (
  <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/55 transition-colors duration-200 ease-ease peer-focus:text-brand">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
  </span>
);

function Field({
  id,
  label,
  full = false,
  required = false,
  error,
  children,
}: {
  id: string;
  label: string;
  full?: boolean;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        'relative bg-ink',
        full ? 'sm:col-span-2' : '',
        error ? 'ring-1 ring-brand ring-inset' : '',
      ].join(' ')}
    >
      <label
        htmlFor={id}
        className={[
          'pointer-events-none absolute left-[22px] top-[14px] font-mono text-[9.5px] uppercase tracking-[0.18em]',
          error ? 'text-brand' : 'text-white/45',
        ].join(' ')}
      >
        {label}
        {required ? <span className="ml-[3px] text-brand">*</span> : null}
      </label>
      {children}
      {error ? (
        <p
          role="alert"
          className="absolute bottom-[6px] left-[22px] right-[22px] font-mono text-[10px] uppercase tracking-[0.14em] text-brand"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function LeadForm({
  settings = {},
  content = {},
}: {
  settings?: LocalizedRecord;
  content?: LocalizedRecord;
}) {
  const t = useTranslations('form');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const fallbackContacts = t.raw('contacts') as Contact[];
  const contacts = [
    {
      k: fallbackContacts[0]?.k || 'Телефон',
      v:
        settings['contact.phone_display'] ||
        fallbackContacts[0]?.v ||
        '+380 (97) 969 04 03',
    },
    {
      k: fallbackContacts[1]?.k || 'Email',
      v:
        settings['contact.email'] ||
        fallbackContacts[1]?.v ||
        'eurocomfortbc@gmail.com',
    },
    {
      k: fallbackContacts[2]?.k || 'Адреса',
      v: settings['contact.address'] || fallbackContacts[2]?.v || '',
    },
    fallbackContacts[3],
  ].filter(Boolean) as Contact[];

  const optType = t.raw('options.type') as string[];
  const optArea = t.raw('options.area') as string[];
  const optStage = t.raw('options.stage') as string[];
  const optSeg = t.raw('options.segment') as string[];

  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // подсветка перевода ошибок по коду
  const errorText = (code?: FieldErrorCode) =>
    code ? t(`errors.${code}` as 'errors.phoneRequired') : '';

  // живая валидация: при изменении значения поля убираем его ошибку
  const clearError = (key: keyof FieldErrors) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setPhone(formatted);
    if (errors.phone) clearError('phone');
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'loading') return;
    setServerError(null);

    const fd = new FormData(e.currentTarget);
    const input: LeadInput = {
      name: (fd.get('name') as string) || undefined,
      phone: (fd.get('phone') as string) || undefined,
      type: (fd.get('type') as string) || undefined,
      area: (fd.get('area') as string) || undefined,
      stage: (fd.get('stage') as string) || undefined,
      city: (fd.get('city') as string) || undefined,
      segment: (fd.get('segment') as string) || undefined,
      comment: (fd.get('message') as string) || undefined,
      locale,
      page:
        typeof window !== 'undefined'
          ? window.location.pathname
          : undefined,
    };

    const localErrors = validateLead(input);
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      setStatus('error');
      // фокусируем первое сбойное поле
      const firstKey = Object.keys(localErrors)[0];
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstKey}"]`)
        ?.focus();
      return;
    }
    setErrors({});
    setStatus('loading');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        // ВАЖНО: ни name, ни phone, ни URL с PII не уходят в query string.
        body: JSON.stringify(input),
        // не кешируем — заявки всегда live
        cache: 'no-store',
      });

      if (res.status === 422) {
        const json = (await res.json().catch(() => null)) as
          | { fieldErrors?: FieldErrors }
          | null;
        setErrors(json?.fieldErrors ?? {});
        setStatus('error');
        return;
      }
      if (!res.ok) {
        setServerError(t('errors.server'));
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setServerError(t('errors.network'));
      setStatus('error');
    }
  };

  // когда форма ушла в success — больше не возвращаемся
  useEffect(() => {
    if (status !== 'success') return;
    // сбрасываем DOM значения, чтобы при повторной отправке поля были пусты
    formRef.current?.reset();
    setPhone('');
  }, [status]);

  const hasFieldErrors = Object.keys(errors).length > 0;
  const inputBase =
    'peer w-full min-h-[44px] bg-transparent px-[22px] pb-[18px] pt-[42px] font-body text-[16px] text-white outline-none focus:[box-shadow:inset_0_-2px_0_#E11D2A]';
  const selectBase =
    'peer w-full min-h-[44px] cursor-pointer appearance-none bg-transparent px-[22px] pb-[18px] pl-[22px] pr-[44px] pt-[42px] font-body text-[16px] text-white outline-none';

  return (
    <section
      id="contact"
      className="section--dark relative bg-ink py-[clamp(72px,11vh,150px)] text-white"
    >
      <div className="wrap grid grid-cols-12 gap-x-6">
        <div className="col-span-12 lg:col-span-4">
          <Reveal as="p" className="eyebrow">
            {t('eyebrow')}
          </Reveal>
          <Reveal
            as="h2"
            i={1}
            className="display-title mt-[14px]"
            style={{ fontSize: 'clamp(2rem,4vw,3.4rem)' }}
          >
            <RichText value={content['lead.title']}>
              {t('title1')}
              <br />
              <span className="mark">{t('titleMark')}</span>
            </RichText>
          </Reveal>
          <div className="mt-[42px] flex flex-col gap-[22px]">
            {contacts.map((c, idx) => (
              <Reveal key={c.k} i={idx + 2} className="flex flex-col gap-[5px]">
                <span className="font-mono text-[10.5px] uppercase tracking-monoXl text-white/50">
                  {c.k}
                </span>
                <span className="text-[18px] text-white">{c.v}</span>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal i={2} className="col-span-12 mt-12 lg:col-span-7 lg:col-start-6 lg:mt-0">
          <form
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            aria-busy={status === 'loading'}
            className="grid grid-cols-1 gap-px border border-hair-d bg-hair-d sm:grid-cols-2"
          >
            <Field
              id="f-name"
              label={t('fields.name')}
              required
              error={errorText(errors.name)}
            >
              <input
                id="f-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                aria-required="true"
                maxLength={120}
                onInput={() => errors.name && clearError('name')}
                className={inputBase}
              />
            </Field>

            <Field
              id="f-phone"
              label={t('fields.phone')}
              required
              error={errorText(errors.phone)}
            >
              <input
                id="f-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                required
                aria-required="true"
                placeholder="+380 (__) ___ __ __"
                value={phone}
                onChange={onPhoneChange}
                maxLength={32}
                className={inputBase}
              />
            </Field>

            <Field
              id="f-type"
              label={t('fields.type')}
              required
              error={errorText(errors.type)}
            >
              <select
                id="f-type"
                name="type"
                defaultValue=""
                required
                aria-required="true"
                onChange={() => errors.type && clearError('type')}
                className={selectBase}
              >
                <option value="" disabled hidden></option>
                {optType.map((o) => (
                  <option key={o} className="bg-[#141414] text-white">
                    {o}
                  </option>
                ))}
              </select>
              <Chev />
            </Field>
            <Field
              id="f-area"
              label={t('fields.area')}
              required
              error={errorText(errors.area)}
            >
              <select
                id="f-area"
                name="area"
                defaultValue=""
                required
                aria-required="true"
                onChange={() => errors.area && clearError('area')}
                className={selectBase}
              >
                <option value="" disabled hidden></option>
                {optArea.map((o) => (
                  <option key={o} className="bg-[#141414] text-white">
                    {o}
                  </option>
                ))}
              </select>
              <Chev />
            </Field>
            <Field
              id="f-stage"
              label={t('fields.stage')}
              required
              error={errorText(errors.stage)}
            >
              <select
                id="f-stage"
                name="stage"
                defaultValue=""
                required
                aria-required="true"
                onChange={() => errors.stage && clearError('stage')}
                className={selectBase}
              >
                <option value="" disabled hidden></option>
                {optStage.map((o) => (
                  <option key={o} className="bg-[#141414] text-white">
                    {o}
                  </option>
                ))}
              </select>
              <Chev />
            </Field>
            <Field
              id="f-city"
              label={t('fields.city')}
              required
              error={errorText(errors.city)}
            >
              <input
                id="f-city"
                name="city"
                type="text"
                autoComplete="address-level2"
                required
                aria-required="true"
                maxLength={120}
                onInput={() => errors.city && clearError('city')}
                className={inputBase}
              />
            </Field>
            <Field
              id="f-seg"
              label={t('fields.segment')}
              full
              required
              error={errorText(errors.segment)}
            >
              <select
                id="f-seg"
                name="segment"
                defaultValue=""
                required
                aria-required="true"
                onChange={() => errors.segment && clearError('segment')}
                className={selectBase}
              >
                <option value="" disabled hidden></option>
                {optSeg.map((o) => (
                  <option key={o} className="bg-[#141414] text-white">
                    {o}
                  </option>
                ))}
              </select>
              <Chev />
            </Field>
            <Field
              id="f-msg"
              label={t('fields.message')}
              full
              error={errorText(errors.comment)}
            >
              <textarea
                id="f-msg"
                name="message"
                rows={3}
                maxLength={2000}
                onInput={() => errors.comment && clearError('comment')}
                className="peer w-full min-h-[120px] resize-y bg-transparent px-[22px] pb-[18px] pt-[42px] font-body text-[16px] text-white outline-none focus:[box-shadow:inset_0_-2px_0_#E11D2A]"
              />
            </Field>

            {status === 'success' ? (
              <div
                role="status"
                aria-live="polite"
                className="col-span-1 flex items-center gap-[18px] bg-ink p-[40px_22px] text-white sm:col-span-2"
              >
                <span className="text-brand">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                <span>{t('ok')}</span>
              </div>
            ) : (
              <div className="col-span-1 flex flex-col items-stretch justify-between gap-5 bg-ink p-[22px] sm:col-span-2 sm:flex-row sm:items-center">
                <span className="max-w-[40ch] font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/40">
                  {t('note')}
                </span>
                <div className="flex flex-col items-stretch gap-3 sm:items-end">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? t('sending') : t('submit')}
                    {status !== 'loading' ? <span className="arr">→</span> : null}
                  </button>
                  {(serverError || hasFieldErrors) && status === 'error' ? (
                    <p
                      role="alert"
                      aria-live="assertive"
                      className="max-w-[44ch] font-mono text-[11px] uppercase tracking-[0.12em] text-brand sm:text-right"
                    >
                      {serverError ?? t('errors.title')}
                    </p>
                  ) : null}
                </div>
              </div>
            )}
          </form>
        </Reveal>
      </div>
      <span className="sr-only">{tCommon('emailHref')}</span>
    </section>
  );
}
