/**
 * Схеми вузлів для секції «Варіанти» — bespoke артворк, портований 1:1.
 * Геометрія статична; підписи (amb / dim) приходять із JSON (schematic.caption/dim),
 * активна схема визначається `active`.
 */
type Cap = { caption: string; dim: string };

export default function VariantSchematics({
  diagram,
  active,
  caps,
}: {
  diagram: string;
  active: number;
  caps: Cap[];
}) {
  const cls = (i: number) => `vschem ${active === i ? 'is-active' : ''}`;

  if (diagram === 'panoramic') {
    return (
      <>
        <svg className={cls(0)} viewBox="0 0 280 150" role="img" aria-label={caps[0].caption}>
          <text className="amb" x="18" y="26">{caps[0].caption}</text>
          <rect className="an-glass" x="18" y="62" width="106" height="22" />
          <rect className="an-glass" x="156" y="62" width="106" height="22" />
          <rect className="an-fill" x="124" y="62" width="32" height="22" />
          <rect className="an-dot" x="137" y="69" width="6" height="6" />
          <line className="an-lead" x1="140" y1="56" x2="140" y2="90" />
          <line className="an-thin" x1="124" y1="104" x2="156" y2="104" />
          <line className="an-thin" x1="124" y1="99" x2="124" y2="109" />
          <line className="an-thin" x1="156" y1="99" x2="156" y2="109" />
          <text className="dim" x="140" y="126" textAnchor="middle">{caps[0].dim}</text>
        </svg>
        <svg className={cls(1)} viewBox="0 0 280 150" role="img" aria-label={caps[1].caption}>
          <text className="amb" x="18" y="26">{caps[1].caption}</text>
          <rect className="an-glass" x="18" y="62" width="103" height="22" />
          <rect className="an-glass" x="159" y="62" width="103" height="22" />
          <rect className="an-sec" x="121" y="50" width="38" height="46" />
          <line className="an-thin" x1="140" y1="50" x2="140" y2="96" strokeDasharray="4 4" />
          <line className="an-thin" x1="121" y1="106" x2="159" y2="106" />
          <line className="an-thin" x1="121" y1="101" x2="121" y2="111" />
          <line className="an-thin" x1="159" y1="101" x2="159" y2="111" />
          <text className="dim" x="140" y="128" textAnchor="middle">{caps[1].dim}</text>
        </svg>
        <svg className={cls(2)} viewBox="0 0 280 150" role="img" aria-label={caps[2].caption}>
          <text className="amb" x="18" y="26">{caps[2].caption}</text>
          <rect className="an-glass" x="18" y="52" width="150" height="20" />
          <rect className="an-glass" x="112" y="82" width="150" height="20" />
          <rect className="an-sec" x="112" y="52" width="14" height="50" />
          <rect className="an-sec" x="154" y="52" width="14" height="50" />
          <line className="an-lead" x1="62" y1="42" x2="32" y2="42" />
          <polyline className="an-lead" points="40,37 32,42 40,47" />
          <line className="an-lead" x1="218" y1="112" x2="248" y2="112" />
          <polyline className="an-lead" points="240,107 248,112 240,117" />
          <text className="dim" x="140" y="134" textAnchor="middle">{caps[2].dim}</text>
        </svg>
      </>
    );
  }

  if (diagram === 'facade') {
    return (
      <>
        <svg className={cls(0)} viewBox="0 0 280 150" role="img" aria-label={caps[0].caption}>
          <text className="amb" x="18" y="22">{caps[0].caption}</text>
          <rect className="an-glass" x="26" y="34" width="100" height="36" />
          <rect className="an-glass" x="154" y="34" width="100" height="36" />
          <rect className="an-glass" x="26" y="86" width="100" height="36" />
          <rect className="an-glass" x="154" y="86" width="100" height="36" />
          <rect className="an-sec" x="22" y="70" width="236" height="16" />
          <rect className="an-sec" x="126" y="30" width="28" height="96" />
          <text className="dim" x="140" y="142" textAnchor="middle">{caps[0].dim}</text>
        </svg>
        <svg className={cls(1)} viewBox="0 0 280 150" role="img" aria-label={caps[1].caption}>
          <text className="amb" x="18" y="22">{caps[1].caption}</text>
          <rect className="an-glass" x="18" y="44" width="244" height="14" />
          <line className="an-lead" x1="140" y1="44" x2="140" y2="58" />
          <rect className="an-fill" x="60" y="58" width="40" height="9" />
          <rect className="an-fill" x="180" y="58" width="40" height="9" />
          <rect className="an-sec" x="62" y="67" width="36" height="44" />
          <rect className="an-sec" x="182" y="67" width="36" height="44" />
          <text className="dim" x="140" y="134" textAnchor="middle">{caps[1].dim}</text>
        </svg>
        <svg className={cls(2)} viewBox="0 0 280 150" role="img" aria-label={caps[2].caption}>
          <text className="amb" x="18" y="22">{caps[2].caption}</text>
          <rect className="an-glass" x="30" y="32" width="98" height="40" />
          <rect className="an-glass" x="152" y="32" width="98" height="40" />
          <rect className="an-glass" x="30" y="86" width="98" height="40" />
          <rect className="an-glass" x="152" y="86" width="98" height="40" />
          <line className="an-sec" x1="140" y1="79" x2="110" y2="52" />
          <line className="an-sec" x1="140" y1="79" x2="170" y2="52" />
          <line className="an-sec" x1="140" y1="79" x2="110" y2="106" />
          <line className="an-sec" x1="140" y1="79" x2="170" y2="106" />
          <circle className="an-dot" cx="110" cy="52" r="4" />
          <circle className="an-dot" cx="170" cy="52" r="4" />
          <circle className="an-dot" cx="110" cy="106" r="4" />
          <circle className="an-dot" cx="170" cy="106" r="4" />
          <circle className="an-sec" cx="140" cy="79" r="6" />
          <text className="dim" x="140" y="142" textAnchor="middle">{caps[2].dim}</text>
        </svg>
      </>
    );
  }

  if (diagram === 'sliding') {
    return (
      <>
        <svg className={cls(0)} viewBox="0 0 280 150" role="img" aria-label={caps[0].caption}>
          <text className="amb" x="18" y="26">{caps[0].caption}</text>
          <line className="an-thin" x1="22" y1="70" x2="258" y2="70" strokeDasharray="4 4" />
          <line className="an-thin" x1="22" y1="90" x2="258" y2="90" strokeDasharray="4 4" />
          <rect className="an-glass" x="30" y="62" width="120" height="16" />
          <rect className="an-glass" x="130" y="82" width="120" height="16" />
          <rect className="an-sec" x="146" y="62" width="8" height="36" />
          <line className="an-lead" x1="120" y1="50" x2="70" y2="50" />
          <polyline className="an-lead" points="78,45 70,50 78,55" />
          <text className="dim" x="140" y="128" textAnchor="middle">{caps[0].dim}</text>
        </svg>
        <svg className={cls(1)} viewBox="0 0 280 150" role="img" aria-label={caps[1].caption}>
          <text className="amb" x="18" y="26">{caps[1].caption}</text>
          <line className="an-thin" x1="22" y1="74" x2="258" y2="74" strokeDasharray="4 4" />
          <rect className="an-glass" x="30" y="66" width="110" height="16" />
          <rect className="an-glass" x="150" y="86" width="100" height="16" />
          <rect className="an-sec" x="142" y="66" width="8" height="16" />
          <line className="an-lead" x1="120" y1="52" x2="70" y2="52" />
          <polyline className="an-lead" points="78,47 70,52 78,57" />
          <text className="dim" x="140" y="128" textAnchor="middle">{caps[1].dim}</text>
        </svg>
        <svg className={cls(2)} viewBox="0 0 280 150" role="img" aria-label={caps[2].caption}>
          <text className="amb" x="18" y="26">{caps[2].caption}</text>
          <line className="an-thin" x1="22" y1="80" x2="258" y2="80" strokeDasharray="4 4" />
          <polyline className="an-glass" points="40,80 70,58 100,80 130,58 160,80" fill="none" />
          <rect className="an-glass" x="186" y="72" width="62" height="16" />
          <circle className="an-dot" cx="70" cy="58" r="3" />
          <circle className="an-dot" cx="130" cy="58" r="3" />
          <line className="an-lead" x1="210" y1="58" x2="160" y2="58" />
          <polyline className="an-lead" points="168,53 160,58 168,63" />
          <text className="dim" x="140" y="128" textAnchor="middle">{caps[2].dim}</text>
        </svg>
      </>
    );
  }

  // custom-forms
  return (
    <>
      <svg className={cls(0)} viewBox="0 0 280 150" role="img" aria-label={caps[0].caption}>
        <text className="amb" x="18" y="24">{caps[0].caption}</text>
        <path className="an-glass" d="M96 120 L96 70 A44 44 0 0 1 184 70 L184 120 Z" />
        <line className="an-thin" x1="140" y1="32" x2="140" y2="120" />
        <line className="an-lead" x1="140" y1="70" x2="178" y2="46" />
        <text className="dim" x="140" y="142" textAnchor="middle">{caps[0].dim}</text>
      </svg>
      <svg className={cls(1)} viewBox="0 0 280 150" role="img" aria-label={caps[1].caption}>
        <text className="amb" x="18" y="24">{caps[1].caption}</text>
        <path className="an-glass" d="M40 120 L70 56 L100 120 Z" />
        <path className="an-glass" d="M150 120 L150 78 L240 50 L240 120 Z" />
        <line className="an-thin" x1="70" y1="56" x2="70" y2="120" />
        <line className="an-thin" x1="195" y1="64" x2="195" y2="120" />
        <text className="dim" x="140" y="142" textAnchor="middle">{caps[1].dim}</text>
      </svg>
      <svg className={cls(2)} viewBox="0 0 280 150" role="img" aria-label={caps[2].caption}>
        <text className="amb" x="18" y="24">{caps[2].caption}</text>
        <circle className="an-glass" cx="110" cy="80" r="40" />
        <line className="an-thin" x1="110" y1="40" x2="110" y2="120" />
        <line className="an-thin" x1="70" y1="80" x2="150" y2="80" />
        <ellipse className="an-glass" cx="212" cy="80" rx="44" ry="30" />
        <line className="an-thin" x1="168" y1="80" x2="256" y2="80" />
        <text className="dim" x="140" y="142" textAnchor="middle">{caps[2].dim}</text>
      </svg>
    </>
  );
}
