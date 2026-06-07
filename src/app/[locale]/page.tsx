import { setRequestLocale } from 'next-intl/server';
import SiteHeader from '@/components/SiteHeader';
import SmoothScroll from '@/components/SmoothScroll';
import ScrollSpine from '@/components/ScrollSpine';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import Categories from '@/components/sections/Categories';
import WhyUs from '@/components/sections/WhyUs';
import Steps from '@/components/sections/Steps';
import Projects from '@/components/sections/Projects';
import Testimonials from '@/components/sections/Testimonials';
import LeadForm from '@/components/sections/LeadForm';
import Faq from '@/components/sections/Faq';
import Footer from '@/components/sections/Footer';
import { routing, type Locale } from '@/i18n/routing';
import { getLandingData } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
  setRequestLocale(currentLocale);
  const data = await getLandingData(currentLocale);

  return (
    <>
      <SmoothScroll />
      <ScrollSpine />
      <SiteHeader settings={data.settings} />
      <main id="top">
        <Hero content={data.content} />
        <Features content={data.content} />
        <Categories categories={data.categories} content={data.content} />
        <WhyUs content={data.content} />
        <Steps content={data.content} />
        <Projects projects={data.projects} content={data.content} />
        <Testimonials testimonials={data.testimonials} content={data.content} />
        <LeadForm settings={data.settings} content={data.content} />
        <Faq items={data.faq} content={data.content} />
      </main>
      <Footer categories={data.categories} settings={data.settings} />
    </>
  );
}
