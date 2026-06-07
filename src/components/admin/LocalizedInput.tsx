'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type LocalizedValue = { uk?: string; ru?: string };

/**
 * Поле с двумя вкладками (uk/ru). Пишет два hidden input:
 *   <input name={name + '_uk'} value={uk}>
 *   <input name={name + '_ru'} value={ru}>
 * На сервере (action) их объединяют обратно в jsonb { uk, ru }.
 */
export default function LocalizedInput({
  name,
  defaultValue,
  multiline = false,
  rows = 4,
  required = false,
  label,
}: {
  name: string;
  defaultValue?: LocalizedValue | null;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  label?: string;
}) {
  const [tab, setTab] = useState<'uk' | 'ru'>('uk');
  const [uk, setUk] = useState(defaultValue?.uk ?? '');
  const [ru, setRu] = useState(defaultValue?.ru ?? '');

  const tabBtn = (key: 'uk' | 'ru') => (
    <button
      key={key}
      type="button"
      onClick={() => setTab(key)}
      className={cn(
        'h-7 border border-hair-l px-3 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors',
        tab === key ? 'bg-ink text-white border-ink' : 'bg-paper text-ink hover:bg-ash'
      )}
      aria-pressed={tab === key}
    >
      {key === 'uk' ? 'UK' : 'RU'}
      {(key === 'uk' ? uk : ru).trim() ? '' : ' ·'}
    </button>
  );

  const inputCls =
    'h-10 w-full border border-hair-l bg-paper px-3 text-[14px] text-ink outline-none focus:border-ink';
  const textareaCls =
    'w-full border border-hair-l bg-paper p-3 text-[14px] text-ink outline-none focus:border-ink';

  return (
    <div className="flex flex-col">
      {label ? (
        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">
          {label}
          {required ? <span className="ml-1 text-brand">*</span> : null}
        </label>
      ) : null}

      <div className="mb-2 flex gap-2">
        {tabBtn('uk')}
        {tabBtn('ru')}
      </div>

      <div className={tab === 'uk' ? '' : 'hidden'}>
        {multiline ? (
          <textarea
            rows={rows}
            value={uk}
            onChange={(e) => setUk(e.target.value)}
            className={textareaCls}
            required={required && tab === 'uk'}
          />
        ) : (
          <input
            type="text"
            value={uk}
            onChange={(e) => setUk(e.target.value)}
            className={inputCls}
            required={required && tab === 'uk'}
          />
        )}
      </div>
      <div className={tab === 'ru' ? '' : 'hidden'}>
        {multiline ? (
          <textarea
            rows={rows}
            value={ru}
            onChange={(e) => setRu(e.target.value)}
            className={textareaCls}
          />
        ) : (
          <input
            type="text"
            value={ru}
            onChange={(e) => setRu(e.target.value)}
            className={inputCls}
          />
        )}
      </div>

      <input type="hidden" name={`${name}_uk`} value={uk} />
      <input type="hidden" name={`${name}_ru`} value={ru} />
    </div>
  );
}
