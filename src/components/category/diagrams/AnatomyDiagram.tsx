import type { Locale } from '@/i18n/routing';

/**
 * Анатомічні розрізи вузлів — bespoke артворк, портований 1:1 зі статичних
 * сторінок. Геометрія статична; підписи деталей (an-lbl / an-sub) приходять із
 * JSON (anatomy.parts), технічні ambient-аннотації локалізуються через t().
 */
type Part = { idx: string; label: string; sub?: string };
type DiagProps = { p: Part[]; t: (uk: string, ru: string) => string };

function PanoramicAnatomy({ p, t }: DiagProps) {
  return (
    <svg viewBox="0 0 1100 640" role="img" aria-label="Технічний розріз панорамного скління: алюмінієвий профіль, склопакет, фурнітура, термоміст з ущільнювачем, прихований поріг">
        <g>
          <rect className="an-floor" x="200" y="30" width="280" height="46" fill="none"></rect>
          <line className="an-hatch" x1="216" y1="76" x2="246" y2="30"></line>
          <line className="an-hatch" x1="256" y1="76" x2="286" y2="30"></line>
          <line className="an-hatch" x1="296" y1="76" x2="326" y2="30"></line>
          <line className="an-hatch" x1="336" y1="76" x2="366" y2="30"></line>
          <line className="an-hatch" x1="376" y1="76" x2="406" y2="30"></line>
          <line className="an-hatch" x1="416" y1="76" x2="446" y2="30"></line>
          <text className="an-amb" x="200" y="20">{t('ПЕРЕКРИТТЯ','ПЕРЕКРЫТИЕ')}</text>
        </g>
        <g>
          <rect className="an-sec" x="320" y="76" width="80" height="46"></rect>
          <line className="an-thin" x1="320" y1="92" x2="400" y2="92"></line>
          <line className="an-thin" x1="320" y1="108" x2="400" y2="108" strokeDasharray="4 4"></line>
        </g>
        <g>
          <rect className="an-glass" x="338" y="122" width="8" height="352"></rect>
          <rect className="an-glass" x="362" y="122" width="8" height="352"></rect>
          <rect className="an-fill" x="346" y="122" width="16" height="14"></rect>
          <rect className="an-fill" x="346" y="460" width="16" height="14"></rect>
        </g>
        <g>
          <rect className="an-sec" x="372" y="284" width="14" height="40"></rect>
          <circle className="an-thin" cx="379" cy="304" r="5"></circle>
        </g>
        <g>
          <rect className="an-sec" x="320" y="474" width="80" height="44"></rect>
          <line className="an-thin" x1="320" y1="490" x2="400" y2="490" strokeDasharray="4 4"></line>
          <rect className="an-fill" x="332" y="474" width="10" height="8"></rect>
          <rect className="an-fill" x="366" y="474" width="10" height="8"></rect>
        </g>
        <g>
          <rect className="an-sec" x="300" y="518" width="120" height="26"></rect>
          <line className="an-thin" x1="300" y1="531" x2="420" y2="531"></line>
        </g>
        <g>
          <rect className="an-floor" x="160" y="544" width="400" height="52" fill="none"></rect>
          <line className="an-hatch" x1="176" y1="596" x2="212" y2="544"></line>
          <line className="an-hatch" x1="226" y1="596" x2="262" y2="544"></line>
          <line className="an-hatch" x1="276" y1="596" x2="312" y2="544"></line>
          <line className="an-hatch" x1="326" y1="596" x2="362" y2="544"></line>
          <line className="an-hatch" x1="376" y1="596" x2="412" y2="544"></line>
          <line className="an-hatch" x1="426" y1="596" x2="462" y2="544"></line>
          <line className="an-hatch" x1="476" y1="596" x2="512" y2="544"></line>
          <text className="an-amb" x="160" y="620">{t('ПІДЛОГА / СТЯЖКА · НУЛЬОВИЙ ПОРІГ','ПОЛ / СТЯЖКА · НУЛЕВОЙ ПОРОГ')}</text>
        </g>
        <g>
          <line className="an-thin" x1="240" y1="122" x2="240" y2="474"></line>
          <line className="an-thin" x1="232" y1="122" x2="248" y2="122"></line>
          <line className="an-thin" x1="232" y1="474" x2="248" y2="474"></line>
          <text className="an-amb" x="226" y="310" transform="rotate(-90 226 310)" textAnchor="middle">{t('ДО 3 000 ММ','ДО 3 000 ММ')}</text>
        </g>
        <g className="an-side">
          <g className="an-point">
            <line className="an-lead" pathLength="1" x1="400" y1="99" x2="620" y2="99"></line>
            <text className="an-idx" x="636" y="95">01</text>
            <text className="an-lbl" x="672" y="95">{p[0].label}</text>
            <text className="an-sub" x="672" y="117">{p[0].sub}</text>
            <g className="an-bubble"><circle cx="400" cy="99" r="11"></circle><text x="400" y="99">01</text></g>
          </g>
          <g className="an-point">
            <line className="an-lead" pathLength="1" x1="370" y1="210" x2="620" y2="210"></line>
            <text className="an-idx" x="636" y="206">02</text>
            <text className="an-lbl" x="672" y="206">{p[1].label}</text>
            <text className="an-sub" x="672" y="228">{p[1].sub}</text>
            <g className="an-bubble"><circle cx="370" cy="210" r="11"></circle><text x="370" y="210">02</text></g>
          </g>
          <g className="an-point">
            <line className="an-lead" pathLength="1" x1="386" y1="304" x2="620" y2="304"></line>
            <text className="an-idx" x="636" y="300">03</text>
            <text className="an-lbl" x="672" y="300">{p[2].label}</text>
            <text className="an-sub" x="672" y="322">{p[2].sub}</text>
            <g className="an-bubble"><circle cx="386" cy="304" r="11"></circle><text x="386" y="304">03</text></g>
          </g>
          <g className="an-point">
            <line className="an-lead" pathLength="1" x1="400" y1="490" x2="620" y2="490"></line>
            <text className="an-idx" x="636" y="486">04</text>
            <text className="an-lbl" x="672" y="486">{p[3].label}</text>
            <text className="an-sub" x="672" y="508">{p[3].sub}</text>
            <g className="an-bubble"><circle cx="400" cy="490" r="11"></circle><text x="400" y="490">04</text></g>
          </g>
          <g className="an-point">
            <polyline className="an-lead" pathLength="1" points="420,531 560,531 590,566 620,566"></polyline>
            <text className="an-idx" x="636" y="562">05</text>
            <text className="an-lbl" x="672" y="562">{p[4].label}</text>
            <text className="an-sub" x="672" y="584">{p[4].sub}</text>
            <g className="an-bubble"><circle cx="420" cy="531" r="11"></circle><text x="420" y="531">05</text></g>
          </g>
        </g>
      </svg>
  );
}

function FacadeAnatomy({ p, t }: DiagProps) {
  return (
    <svg viewBox="0 0 1290 640" role="img" aria-label="Горизонтальний розріз вузла стійко-ригельного фасаду: алюмінієва стійка, склопакети, притискна планка, ущільнювачі EPDM, термоміст та дренажний канал">
        <text className="an-amb" x="80" y="40">{t('ЗОВНІ · EXTERIOR','СНАРУЖИ · EXTERIOR')}</text>
        <text className="an-amb" x="80" y="612">{t('ВСЕРЕДИНІ · INTERIOR','ВНУТРИ · INTERIOR')}</text>
        <g>
          <line className="an-thin" x1="58" y1="92" x2="58" y2="494"></line>
          <line className="an-thin" x1="50" y1="92" x2="66" y2="92"></line>
          <line className="an-thin" x1="50" y1="494" x2="66" y2="494"></line>
          <text className="an-amb" x="40" y="293" transform="rotate(-90 40 293)" textAnchor="middle">{t('МОНТАЖНА ГЛИБИНА · 50–65 ММ','МОНТАЖНАЯ ГЛУБИНА · 50–65 ММ')}</text>
        </g>
        <rect className="an-sec" x="504" y="92" width="92" height="14"></rect>
        <g>
          <rect className="an-sec" x="494" y="106" width="112" height="34"></rect>
          <line className="an-thin" x1="550" y1="106" x2="550" y2="260" strokeDasharray="3 5"></line>
          <circle className="an-thin" cx="550" cy="123" r="3"></circle>
        </g>
        <rect className="an-fill" x="485" y="140" width="30" height="14"></rect>
        <rect className="an-fill" x="585" y="140" width="30" height="14"></rect>
        <g>
          <rect className="an-glass" x="260" y="154" width="225" height="8"></rect>
          <rect className="an-glass" x="260" y="178" width="225" height="8"></rect>
          <rect className="an-fill" x="471" y="162" width="14" height="16"></rect>
          <polyline className="an-thin" points="258,150 252,166 264,182 252,198 258,190" fill="none"></polyline>
        </g>
        <g>
          <rect className="an-glass" x="615" y="154" width="225" height="8"></rect>
          <rect className="an-glass" x="615" y="178" width="225" height="8"></rect>
          <rect className="an-fill" x="615" y="162" width="14" height="16"></rect>
          <polyline className="an-thin" points="842,150 848,166 836,182 848,198 842,190" fill="none"></polyline>
        </g>
        <rect className="an-fill" x="485" y="186" width="30" height="14"></rect>
        <rect className="an-fill" x="585" y="186" width="30" height="14"></rect>
        <rect className="an-sec" x="485" y="200" width="30" height="60"></rect>
        <rect className="an-sec" x="585" y="200" width="30" height="60"></rect>
        <rect className="an-fill" x="485" y="260" width="30" height="16"></rect>
        <rect className="an-fill" x="585" y="260" width="30" height="16"></rect>
        <g>
          <rect className="an-sec" x="485" y="276" width="130" height="218"></rect>
          <rect className="an-thin" x="500" y="291" width="100" height="188" fill="none" strokeDasharray="4 4"></rect>
        </g>
        <g>
          <line className="an-lead" x1="550" y1="360" x2="550" y2="462"></line>
          <polyline className="an-lead" points="542,454 550,464 558,454"></polyline>
        </g>
        <g>
          <line className="an-thin" x1="485" y1="514" x2="615" y2="514"></line>
          <line className="an-thin" x1="485" y1="506" x2="485" y2="522"></line>
          <line className="an-thin" x1="615" y1="506" x2="615" y2="522"></line>
          <text className="an-amb" x="550" y="538" textAnchor="middle">{t('ШИРИНА СТІЙКИ 50–80 ММ','ШИРИНА СТОЙКИ 50–80 ММ')}</text>
        </g>
        <line className="an-thin" x1="80" y1="570" x2="1210" y2="570" strokeDasharray="6 6"></line>
        <g className="an-side">
          <g className="an-point">
            <polyline className="an-lead" pathLength="1" points="612,388 770,388 770,114 870,114"></polyline>
            <text className="an-idx" x="886" y="114">01</text>
            <text className="an-lbl" x="922" y="114">{p[0].label}</text>
            <text className="an-sub" x="922" y="136">{p[0].sub}</text>
            <g className="an-bubble"><circle cx="612" cy="388" r="11"></circle><text x="612" y="388">01</text></g>
          </g>
          <g className="an-point">
            <polyline className="an-lead" pathLength="1" points="719,170 800,170 800,186 870,186"></polyline>
            <text className="an-idx" x="886" y="186">02</text>
            <text className="an-lbl" x="922" y="186">{p[1].label}</text>
            <text className="an-sub" x="922" y="208">{p[1].sub}</text>
            <g className="an-bubble"><circle cx="719" cy="170" r="11"></circle><text x="719" y="170">02</text></g>
          </g>
          <g className="an-point">
            <polyline className="an-lead" pathLength="1" points="606,123 740,123 740,246 870,246"></polyline>
            <text className="an-idx" x="886" y="246">03</text>
            <text className="an-lbl" x="922" y="246">{p[2].label}</text>
            <text className="an-sub" x="922" y="268">{p[2].sub}</text>
            <g className="an-bubble"><circle cx="606" cy="123" r="11"></circle><text x="606" y="123">03</text></g>
          </g>
          <g className="an-point">
            <polyline className="an-lead" pathLength="1" points="612,193 760,193 760,311 870,311"></polyline>
            <text className="an-idx" x="886" y="311">04</text>
            <text className="an-lbl" x="922" y="311">{p[3].label}</text>
            <text className="an-sub" x="922" y="333">{p[3].sub}</text>
            <g className="an-bubble"><circle cx="612" cy="193" r="11"></circle><text x="612" y="193">04</text></g>
          </g>
          <g className="an-point">
            <polyline className="an-lead" pathLength="1" points="612,268 780,268 780,408 870,408"></polyline>
            <text className="an-idx" x="886" y="408">05</text>
            <text className="an-lbl" x="922" y="408">{p[4].label}</text>
            <text className="an-sub" x="922" y="430">{p[4].sub}</text>
            <g className="an-bubble"><circle cx="612" cy="268" r="11"></circle><text x="612" y="268">05</text></g>
          </g>
          <g className="an-point">
            <polyline className="an-lead" pathLength="1" points="550,463 730,463 870,491"></polyline>
            <text className="an-idx" x="886" y="491">06</text>
            <text className="an-lbl" x="922" y="491">{p[5].label}</text>
            <text className="an-sub" x="922" y="513">{p[5].sub}</text>
            <g className="an-bubble"><circle cx="550" cy="463" r="11"></circle><text x="550" y="463">06</text></g>
          </g>
        </g>
      </svg>
  );
}

function SlidingAnatomy({ p, t }: DiagProps) {
  return (
    <svg viewBox="0 0 1100 640" role="img" aria-label="Вертикальний розріз порога розсувної системи: дві стулки на роликових каретках, поріг-рейка, щіткові ущільнювачі, склопакети та підйомний механізм Lift and Slide">
        <text className="an-amb" x="150" y="40">{t('ЗОВНІ · ТЕРАСА','СНАРУЖИ · ТЕРРАСА')}</text>
        <text className="an-amb" x="430" y="40">{t('ВСЕРЕДИНІ · ДІМ','ВНУТРИ · ДОМ')}</text>
        <g>
          <rect className="an-glass" x="300" y="70" width="8" height="350"></rect>
          <rect className="an-glass" x="324" y="70" width="8" height="350"></rect>
          <rect className="an-fill" x="308" y="70" width="16" height="14"></rect>
          <rect className="an-fill" x="308" y="406" width="16" height="14"></rect>
        </g>
        <g>
          <rect className="an-glass" x="392" y="70" width="8" height="350"></rect>
          <rect className="an-glass" x="416" y="70" width="8" height="350"></rect>
          <rect className="an-fill" x="400" y="70" width="16" height="14"></rect>
          <rect className="an-fill" x="400" y="406" width="16" height="14"></rect>
        </g>
        <g>
          <rect className="an-sec" x="336" y="120" width="52" height="40"></rect>
          <line className="an-hatch" x1="350" y1="124" x2="350" y2="156"></line>
          <line className="an-hatch" x1="362" y1="124" x2="362" y2="156"></line>
          <line className="an-hatch" x1="374" y1="124" x2="374" y2="156"></line>
        </g>
        <rect className="an-sec" x="290" y="420" width="52" height="48"></rect>
        <rect className="an-sec" x="382" y="420" width="52" height="48"></rect>
        <g>
          <rect className="an-sec" x="262" y="468" width="240" height="40"></rect>
          <line className="an-thin" x1="262" y1="484" x2="502" y2="484" strokeDasharray="4 4"></line>
          <rect className="an-fill" x="312" y="460" width="8" height="10"></rect>
          <rect className="an-fill" x="404" y="460" width="8" height="10"></rect>
        </g>
        <g>
          <rect className="an-sec" x="300" y="430" width="32" height="34"></rect>
          <circle className="an-thin" cx="316" cy="462" r="10"></circle>
          <circle className="an-dot" cx="316" cy="462" r="3"></circle>
        </g>
        <g>
          <rect className="an-sec" x="392" y="430" width="32" height="34"></rect>
          <circle className="an-thin" cx="408" cy="462" r="10"></circle>
          <circle className="an-dot" cx="408" cy="462" r="3"></circle>
        </g>
        <g>
          <rect className="an-floor" x="150" y="508" width="420" height="56" fill="none"></rect>
          <line className="an-hatch" x1="166" y1="564" x2="202" y2="508"></line>
          <line className="an-hatch" x1="216" y1="564" x2="252" y2="508"></line>
          <line className="an-hatch" x1="266" y1="564" x2="302" y2="508"></line>
          <line className="an-hatch" x1="316" y1="564" x2="352" y2="508"></line>
          <line className="an-hatch" x1="366" y1="564" x2="402" y2="508"></line>
          <line className="an-hatch" x1="416" y1="564" x2="452" y2="508"></line>
          <line className="an-hatch" x1="466" y1="564" x2="502" y2="508"></line>
          <text className="an-amb" x="150" y="588">{t('ПІДЛОГА / СТЯЖКА · НИЗЬКИЙ ПОРІГ 20 ММ','ПОЛ / СТЯЖКА · НИЗКИЙ ПОРОГ 20 ММ')}</text>
        </g>
        <g>
          <line className="an-thin" x1="226" y1="70" x2="226" y2="420"></line>
          <line className="an-thin" x1="218" y1="70" x2="234" y2="70"></line>
          <line className="an-thin" x1="218" y1="420" x2="234" y2="420"></line>
          <text className="an-amb" x="212" y="245" transform="rotate(-90 212 245)" textAnchor="middle">{t('ДО 3 000 ММ','ДО 3 000 ММ')}</text>
        </g>
        <g className="an-side">
          <g className="an-point">
            <line className="an-lead" pathLength="1" x1="424" y1="203" x2="620" y2="118"></line>
            <text className="an-idx" x="636" y="114">01</text>
            <text className="an-lbl" x="672" y="114">{p[0].label}</text>
            <text className="an-sub" x="672" y="136">{p[0].sub}</text>
            <g className="an-bubble"><circle cx="424" cy="203" r="11"></circle><text x="424" y="203">01</text></g>
          </g>
          <g className="an-point">
            <line className="an-lead" pathLength="1" x1="432" y1="443" x2="620" y2="210"></line>
            <text className="an-idx" x="636" y="206">02</text>
            <text className="an-lbl" x="672" y="206">{p[1].label}</text>
            <text className="an-sub" x="672" y="228">{p[1].sub}</text>
            <g className="an-bubble"><circle cx="432" cy="443" r="11"></circle><text x="432" y="443">02</text></g>
          </g>
          <g className="an-point">
            <line className="an-lead" pathLength="1" x1="386" y1="143" x2="620" y2="302"></line>
            <text className="an-idx" x="636" y="298">03</text>
            <text className="an-lbl" x="672" y="298">{p[2].label}</text>
            <text className="an-sub" x="672" y="320">{p[2].sub}</text>
            <g className="an-bubble"><circle cx="386" cy="143" r="11"></circle><text x="386" y="143">03</text></g>
          </g>
          <g className="an-point">
            <line className="an-lead" pathLength="1" x1="427" y1="462" x2="620" y2="394"></line>
            <text className="an-idx" x="636" y="390">04</text>
            <text className="an-lbl" x="672" y="390">{p[3].label}</text>
            <text className="an-sub" x="672" y="412">{p[3].sub}</text>
            <g className="an-bubble"><circle cx="427" cy="462" r="11"></circle><text x="427" y="462">04</text></g>
          </g>
          <g className="an-point">
            <polyline className="an-lead" pathLength="1" points="503,489 590,489 620,486"></polyline>
            <text className="an-idx" x="636" y="486">05</text>
            <text className="an-lbl" x="672" y="486">{p[4].label}</text>
            <text className="an-sub" x="672" y="508">{p[4].sub}</text>
            <g className="an-bubble"><circle cx="503" cy="489" r="11"></circle><text x="503" y="489">05</text></g>
          </g>
          <g className="an-point">
            <polyline className="an-lead" pathLength="1" points="335,450 560,450 590,566 620,566"></polyline>
            <text className="an-idx" x="636" y="562">06</text>
            <text className="an-lbl" x="672" y="562">{p[5].label}</text>
            <text className="an-sub" x="672" y="584">{p[5].sub}</text>
            <g className="an-bubble"><circle cx="335" cy="450" r="11"></circle><text x="335" y="450">06</text></g>
          </g>
        </g>
      </svg>
  );
}

function CustomAnatomy({ p }: DiagProps) {
  return (
    <svg viewBox="0 0 1100 560" role="img" aria-label="Бібліотека нестандартних форм скління: арка, трапеція, трикутник, коло, скошений кут та сегментна арка з мулінами">
        <g>
          <path className="an-glass" d="M140 250 L140 150 A60 60 0 0 1 260 150 L260 250 Z"></path>
          <line className="an-thin" x1="200" y1="90" x2="200" y2="250"></line>
          <line className="an-thin" x1="140" y1="150" x2="260" y2="150"></line>
          <line className="an-lead" x1="200" y1="150" x2="252" y2="118"></line>
          <text className="an-idx" x="132" y="78">01</text>
          <text className="an-amb" x="200" y="284" textAnchor="middle">{p[0].label}</text>
        </g>
        <g>
          <path className="an-glass" d="M485 250 L485 158 L615 110 L615 250 Z"></path>
          <line className="an-thin" x1="550" y1="134" x2="550" y2="250"></line>
          <line className="an-thin" x1="485" y1="186" x2="615" y2="178"></line>
          <text className="an-idx" x="478" y="98">02</text>
          <text className="an-amb" x="550" y="284" textAnchor="middle">{p[1].label}</text>
        </g>
        <g>
          <path className="an-glass" d="M830 250 L900 100 L970 250 Z"></path>
          <line className="an-thin" x1="900" y1="100" x2="900" y2="250"></line>
          <line className="an-thin" x1="865" y1="175" x2="935" y2="175"></line>
          <text className="an-idx" x="822" y="90">03</text>
          <text className="an-amb" x="900" y="284" textAnchor="middle">{p[2].label}</text>
        </g>
        <g>
          <circle className="an-glass" cx="200" cy="410" r="78"></circle>
          <line className="an-thin" x1="200" y1="332" x2="200" y2="488"></line>
          <line className="an-thin" x1="122" y1="410" x2="278" y2="410"></line>
          <line className="an-lead" x1="200" y1="410" x2="255" y2="410"></line>
          <text className="an-idx" x="116" y="338">04</text>
          <text className="an-amb" x="200" y="520" textAnchor="middle">{p[3].label}</text>
        </g>
        <g>
          <path className="an-glass" d="M488 488 L520 332 L612 332 L584 488 Z"></path>
          <line className="an-thin" x1="504" y1="410" x2="598" y2="410"></line>
          <text className="an-idx" x="478" y="322">05</text>
          <text className="an-amb" x="550" y="520" textAnchor="middle">{p[4].label}</text>
        </g>
        <g>
          <path className="an-glass" d="M822 488 L822 430 Q900 360 978 430 L978 488 Z"></path>
          <line className="an-thin" x1="900" y1="392" x2="900" y2="488"></line>
          <line className="an-thin" x1="822" y1="430" x2="978" y2="430"></line>
          <text className="an-idx" x="814" y="392">06</text>
          <text className="an-amb" x="900" y="520" textAnchor="middle">{p[5].label}</text>
        </g>
      </svg>
  );
}

const MAP: Record<string, (props: DiagProps) => React.JSX.Element> = {
  panoramic: PanoramicAnatomy,
  facade: FacadeAnatomy,
  sliding: SlidingAnatomy,
  custom: CustomAnatomy,
};

export default function AnatomyDiagram({
  diagram,
  parts,
  locale,
}: {
  diagram: string;
  parts: Part[];
  locale: Locale;
}) {
  const Comp = MAP[diagram] ?? PanoramicAnatomy;
  const t = (uk: string, ru: string) => (locale === 'ru' ? ru : uk);
  return <Comp p={parts} t={t} />;
}
