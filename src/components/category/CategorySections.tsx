import AboutSection from './sections/AboutSection';
import AnatomySection from './sections/AnatomySection';
import SpecsSection from './sections/SpecsSection';
import VariantsSection from './sections/VariantsSection';
import type { LSection } from '@/lib/categoryContent';
import type { Locale } from '@/i18n/routing';

/**
 * Рендерить контентні секції перед блоком «Проєкти» (about, anatomy, specs,
 * variants) у порядку з JSON. Секція `faq` рендериться окремо (між Projects і
 * LeadForm), тож тут пропускається. Фон чергується s-base / s-lift за позицією.
 */
export default function CategorySections({
  sections,
  locale,
  diagram,
}: {
  sections: LSection[];
  locale: Locale;
  diagram: string;
}) {
  return (
    <>
      {sections
        .filter((s) => s.type !== 'faq')
        .map((section, idx) => {
          const variant = idx % 2 === 0 ? 'base' : 'lift';
          const key = `${section.type}-${idx}`;

          switch (section.type) {
            case 'about':
              return <AboutSection key={key} section={section} variant={variant} />;
            case 'anatomy':
              return (
                <AnatomySection key={key} section={section} variant={variant} locale={locale} />
              );
            case 'specs':
              return <SpecsSection key={key} section={section} variant={variant} />;
            case 'variants':
              return (
                <VariantsSection
                  key={key}
                  section={section}
                  variant={variant}
                  diagram={diagram}
                />
              );
            default:
              return null;
          }
        })}
    </>
  );
}
