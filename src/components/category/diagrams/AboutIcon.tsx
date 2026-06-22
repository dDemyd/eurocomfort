/**
 * Іконки для пунктів секції «Про систему» (about.points[].icon).
 * Чистий артворк-пиктограми (без тексту), портовані 1:1 зі статичних сторінок.
 */
type IconProps = { name: string };

const common = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const ICONS: Record<string, React.ReactNode> = {
  // panoramic
  'hidden-mount': (
    <>
      <rect x="9" y="7" width="30" height="34" strokeDasharray="3 4" />
      <rect x="15" y="13" width="18" height="22" />
      <path d="M24 13 L24 35" opacity=".5" />
    </>
  ),
  'zero-threshold': (
    <>
      <path d="M10 7 L10 35 L24 35 L24 7" />
      <path d="M24 35 L42 35" />
      <path d="M4 40 L44 40" />
    </>
  ),
  'energy-glass': (
    <>
      <rect x="11" y="8" width="26" height="32" />
      <path d="M19 8 L19 40 M29 8 L29 40" />
      <path d="M41 18 q3 3 0 6 q-3 3 0 6" opacity=".55" />
    </>
  ),
  // facade
  'proven-profiles': (
    <>
      <path d="M24 5 L40 11 V23 C40 33 33 40 24 43 C15 40 8 33 8 23 V11 Z" />
      <path d="M17 23 L22 28 L32 17" />
    </>
  ),
  'shell-engineering': (
    <>
      <rect x="7" y="7" width="34" height="34" />
      <path d="M7 24 H41 M24 7 V41" />
      <path d="M7 7 L24 24" />
    </>
  ),
  'full-cycle': (
    <>
      <path d="M39 16 A15 15 0 1 0 41 26" />
      <path d="M39 7 L39 16 L30 16" />
    </>
  ),
  // sliding
  'lift-slide-motion': (
    <>
      <rect x="6" y="13" width="19" height="24" />
      <rect x="23" y="9" width="19" height="24" />
      <path d="M28 41 L40 41 M37 38 L40 41 L37 44" />
    </>
  ),
  'min-threshold': (
    <>
      <path d="M9 7 L9 31 L23 31 L23 7" />
      <rect x="23" y="31" width="6" height="4" />
      <path d="M29 35 L44 35 M4 35 L9 35" opacity=".9" />
      <path d="M4 40 L44 40" />
    </>
  ),
  'large-sashes': (
    <>
      <rect x="8" y="7" width="32" height="30" />
      <path d="M24 7 L24 37" opacity=".45" />
      <path d="M13 43 L35 43 M16 40 L13 43 L16 46 M32 40 L35 43 L32 46" />
    </>
  ),
  // custom
  'profile-bending': (
    <>
      <path d="M6 40 C6 17 23 7 42 7" />
      <path d="M6 40 L6 33 M6 40 L13 40" />
      <path d="M42 7 L36 9 M42 7 L40 14" />
    </>
  ),
  'any-geometry': (
    <>
      <circle cx="17" cy="19" r="10" />
      <path d="M27 42 L35 18 L43 42 Z" />
      <rect x="6" y="31" width="16" height="13" />
    </>
  ),
  'precise-calc': (
    <>
      <path d="M8 30 L30 8 L40 18 L18 40 Z" />
      <path d="M14 24 L18 28 M20 18 L25 23 M26 12 L30 16" />
    </>
  ),
};

export default function AboutIcon({ name }: IconProps) {
  const body = ICONS[name];
  if (!body) return null;
  return <svg {...common}>{body}</svg>;
}
