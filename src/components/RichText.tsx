import { Fragment, type ReactNode } from 'react';

/**
 * Безопасный мини-парсер строк из CMS.
 * Поддерживает теги:
 *   <red>…</red>  — выделяет фрагмент брендовым красным (.mark)
 *   <b>…</b>      — жирный фрагмент
 *   <br> / <br/>  — перенос строки
 *
 * Текст и атрибуты НЕ интерпретируются как HTML — каждый
 * фрагмент рендерится через React (без dangerouslySetInnerHTML),
 * поэтому XSS невозможен.
 *
 * Использование:
 *   <RichText value="Понад <red>10 000 м²</red><br>засклених об'єктів" />
 *
 * Fallback: если value пусто — рендерится children (ничего).
 */
type Token =
  | { kind: 'text'; text: string }
  | { kind: 'red'; text: string }
  | { kind: 'b'; text: string }
  | { kind: 'br' };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const safeInput = input.replace(/<\/?(?!(?:red|br|b)\b)[a-z][^>]*>/gi, '');
  const re = /<red>([\s\S]*?)<\/red>|<b>([\s\S]*?)<\/b>|<br\s*\/?\s*>/gi;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(safeInput)) !== null) {
    if (m.index > last) {
      tokens.push({ kind: 'text', text: safeInput.slice(last, m.index) });
    }
    if (m[0].toLowerCase().startsWith('<br')) {
      tokens.push({ kind: 'br' });
    } else if (m[1] !== undefined) {
      tokens.push({ kind: 'red', text: m[1] });
    } else {
      tokens.push({ kind: 'b', text: m[2] });
    }
    last = m.index + m[0].length;
  }
  if (last < safeInput.length) {
    tokens.push({ kind: 'text', text: safeInput.slice(last) });
  }
  return tokens;
}

export default function RichText({
  value,
  children,
  className,
}: {
  value?: string | null;
  /** Что отрисовать, если value пустое. Обычно дефолтный JSX из i18n. */
  children?: ReactNode;
  className?: string;
}) {
  const v = (value ?? '').trim();
  if (!v) return <>{children ?? null}</>;

  const tokens = tokenize(v);
  const body = tokens.map((t, i) => {
    if (t.kind === 'br') return <br key={i} />;
    if (t.kind === 'red')
      return (
        <span key={i} className="mark">
          {t.text}
        </span>
      );
    if (t.kind === 'b') return <b key={i}>{t.text}</b>;
    return <Fragment key={i}>{t.text}</Fragment>;
  });

  if (className) return <span className={className}>{body}</span>;
  return <>{body}</>;
}
