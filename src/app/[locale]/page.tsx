import { setRequestLocale } from 'next-intl/server';
import SiteHeader from '@/components/SiteHeader';
import SmoothScroll from '@/components/SmoothScroll';
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SmoothScroll />
      <SiteHeader />
      <main id="top">
        <Hero />
        <Features />
        <Categories />
        <WhyUs />
        <Steps />
        <Projects />
        <Testimonials />
        <LeadForm />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
