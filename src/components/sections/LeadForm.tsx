'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Reveal from '../Reveal';
import type { LocalizedRecord } from '@/lib/queries';

type Contact = { k: string; v: string };

const Chev = () => (
  <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/55 transition-colors duration-200 ease-ease peer-focus:text-brand">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
  </span>
);

function Field({
  id,
  label,
  full = false,
  children,
}: {
  id: string;
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        'relative bg-ink',
        full ? 'sm:col-span-2' : '',
      ].join(' ')}
    >
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-[22px] top-[14px] font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/45"
      >
        {label}
      </label>
      {children}
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
  const fallbackContacts = t.raw('contacts') as Contact[];
  const contacts = [
    { k: fallbackContacts[0]?.k || 'Телефон', v: settings['contact.phone_display'] || fallbackContacts[0]?.v || '+380 (97) 969 04 03' },
    { k: fallbackContacts[1]?.k || 'Email', v: settings['contact.email'] || fallbackContacts[1]?.v || 'eurocomfortbc@gmail.com' },
    { k: fallbackContacts[2]?.k || 'Адреса', v: settings['contact.address'] || fallbackContacts[2]?.v || '' },
    fallbackContacts[3],
  ].filter(Boolean) as Contact[];
  const optType = t.raw('options.type') as string[];
  const optArea = t.raw('options.area') as string[];
  const optStage = t.raw('options.stage') as string[];
  const optSeg = t.raw('options.segment') as string[];

  const [submitted, setSubmitted] = useState(false);

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
            {content['lead.title'] || t('title1')}
            {!content['lead.title'] ? (
              <>
                <br />
                <span className="mark">{t('titleMark')}</span>
              </>
            ) : null}
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
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="grid grid-cols-1 gap-px border border-hair-d bg-hair-d sm:grid-cols-2"
          >
            <Field id="f-name" label={t('fields.name')}>
              <input
                id="f-name"
                name="name"
                type="text"
                autoComplete="name"
                className="peer w-full min-h-[44px] bg-transparent px-[22px] pb-[18px] pt-[42px] font-body text-[16px] text-white outline-none focus:[box-shadow:inset_0_-2px_0_#E11D2A]"
              />
            </Field>
            <Field id="f-phone" label={t('fields.phone')}>
              <input
                id="f-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="peer w-full min-h-[44px] bg-transparent px-[22px] pb-[18px] pt-[42px] font-body text-[16px] text-white outline-none focus:[box-shadow:inset_0_-2px_0_#E11D2A]"
              />
            </Field>

            <Field id="f-type" label={t('fields.type')}>
              <select
                id="f-type"
                name="type"
                defaultValue=""
                className="peer w-full min-h-[44px] cursor-pointer appearance-none bg-transparent px-[22px] pb-[18px] pl-[22px] pr-[44px] pt-[42px] font-body text-[16px] text-white outline-none"
              >
                <option value="" disabled hidden></option>
                {optType.map((o) => <option key={o} className="bg-[#141414] text-white">{o}</option>)}
              </select>
              <Chev />
            </Field>
            <Field id="f-area" label={t('fields.area')}>
              <select
                id="f-area"
                name="area"
                defaultValue=""
                className="peer w-full min-h-[44px] cursor-pointer appearance-none bg-transparent px-[22px] pb-[18px] pl-[22px] pr-[44px] pt-[42px] font-body text-[16px] text-white outline-none"
              >
                <option value="" disabled hidden></option>
                {optArea.map((o) => <option key={o} className="bg-[#141414] text-white">{o}</option>)}
              </select>
              <Chev />
            </Field>
            <Field id="f-stage" label={t('fields.stage')}>
              <select
                id="f-stage"
                name="stage"
                defaultValue=""
                className="peer w-full min-h-[44px] cursor-pointer appearance-none bg-transparent px-[22px] pb-[18px] pl-[22px] pr-[44px] pt-[42px] font-body text-[16px] text-white outline-none"
              >
                <option value="" disabled hidden></option>
                {optStage.map((o) => <option key={o} className="bg-[#141414] text-white">{o}</option>)}
              </select>
              <Chev />
            </Field>
            <Field id="f-city" label={t('fields.city')}>
              <input
                id="f-city"
                name="city"
                type="text"
                autoComplete="address-level2"
                className="peer w-full min-h-[44px] bg-transparent px-[22px] pb-[18px] pt-[42px] font-body text-[16px] text-white outline-none focus:[box-shadow:inset_0_-2px_0_#E11D2A]"
              />
            </Field>
            <Field id="f-seg" label={t('fields.segment')} full>
              <select
                id="f-seg"
                name="segment"
                defaultValue=""
                className="peer w-full min-h-[44px] cursor-pointer appearance-none bg-transparent px-[22px] pb-[18px] pl-[22px] pr-[44px] pt-[42px] font-body text-[16px] text-white outline-none"
              >
                <option value="" disabled hidden></option>
                {optSeg.map((o) => <option key={o} className="bg-[#141414] text-white">{o}</option>)}
              </select>
              <Chev />
            </Field>
            <Field id="f-msg" label={t('fields.message')} full>
              <textarea
                id="f-msg"
                name="message"
                rows={3}
                className="peer w-full min-h-[120px] resize-y bg-transparent px-[22px] pb-[18px] pt-[42px] font-body text-[16px] text-white outline-none focus:[box-shadow:inset_0_-2px_0_#E11D2A]"
              />
            </Field>

            {!submitted ? (
              <div className="col-span-1 flex flex-col items-stretch justify-between gap-5 bg-ink p-[22px] sm:col-span-2 sm:flex-row sm:items-center">
                <span className="max-w-[30ch] font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/40">
                  {t('note')}
                </span>
                <button type="submit" className="btn justify-center">
                  {t('submit')} <span className="arr">→</span>
                </button>
              </div>
            ) : (
              <div className="col-span-1 flex items-center gap-[18px] bg-ink p-[40px_22px] text-white sm:col-span-2">
                <span className="text-brand">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                <span>{t('ok')}</span>
              </div>
            )}
          </form>
        </Reveal>
      </div>
      <span className="sr-only">{tCommon('emailHref')}</span>
    </section>
  );
}
