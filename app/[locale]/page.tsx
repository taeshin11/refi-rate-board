import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { RateCard } from '@/components/RateCard';
import { RateChart } from '@/components/RateChart';
import { LenderTable } from '@/components/LenderTable';
import { AdNativeBanner } from '@/components/AdNativeBanner';
import { AdDisplay } from '@/components/AdDisplay';
import { SchemaLD } from '@/components/SchemaLD';
import { fetchFredSeries } from '@/lib/fred';
import { getLenders } from '@/lib/lenders';
import { routing } from '@/i18n/routing';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('homeTitle'),
    description: t('homeDesc'),
    alternates: {
      canonical: `https://refi-rate-board.vercel.app/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  };
}

function FAQSection() {
  const faqs = [
    {
      q: 'Should I refinance my mortgage in 2026?',
      a: 'Refinancing makes sense if you can lower your rate by at least 0.5%-1%, you plan to stay in the home long enough to recoup closing costs (break-even), and your credit and equity qualify you for a better rate.',
    },
    {
      q: 'How do I calculate my refinance break-even point?',
      a: 'Divide your total closing costs by your monthly savings. For example, $5,000 closing costs ÷ $200 monthly savings = 25 months to break even. If you plan to stay longer, refinancing likely makes sense.',
    },
    {
      q: 'What is the difference between rate-and-term and cash-out refinance?',
      a: 'Rate-and-term refinancing changes your rate or loan length without taking extra cash. Cash-out refinancing lets you borrow more than you owe and receive the difference — useful for home improvements or debt consolidation.',
    },
    {
      q: 'What credit score do I need to refinance?',
      a: 'Most conventional lenders require a 620+ credit score to refinance. For the best rates, aim for 740+. FHA streamline refinance may allow lower scores if you already have an FHA loan.',
    },
    {
      q: 'How much equity do I need to refinance?',
      a: 'Most lenders require at least 20% equity for a conventional refi to avoid PMI. For cash-out refinancing, lenders typically limit you to 80% LTV (20% equity remaining). VA and FHA loans may allow refinancing with less equity.',
    },
    {
      q: 'What are typical refinance closing costs?',
      a: 'Refinance closing costs typically run 2%-5% of the loan amount, or $4,000-$10,000 on a $300,000 loan. Costs include origination fees, appraisal, title insurance, and prepaid items.',
    },
  ];

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions About Refinancing</h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="bg-white rounded-xl border border-cyan-100 shadow-sm">
            <summary className="p-5 font-semibold text-gray-800 cursor-pointer hover:text-cyan-700 list-none flex justify-between items-center">
              {faq.q}
              <span className="text-gray-400 text-lg ml-4">+</span>
            </summary>
            <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });

  const [data30, data15, dataArm, lenders] = await Promise.all([
    fetchFredSeries('MORTGAGE30US', 90),
    fetchFredSeries('MORTGAGE15US', 90),
    fetchFredSeries('MORTGAGE5US', 90),
    getLenders(),
  ]);

  const sorted30 = [...data30].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const sorted15 = [...data15].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const sortedArm = [...dataArm].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Refi rates are typically 0.1-0.2% higher than purchase rates
  const rate30 = parseFloat(sorted30[0]?.value ?? '6.875');
  const rate15 = parseFloat(sorted15[0]?.value ?? '6.125');
  const rateArm = parseFloat(sortedArm[0]?.value ?? '6.25');
  const rateCashOut = parseFloat((rate30 + 0.25).toFixed(3));

  const prevRate30 = parseFloat(sorted30[1]?.value ?? '6.90');
  const prevRate15 = parseFloat(sorted15[1]?.value ?? '6.15');
  const prevRateArm = parseFloat(sortedArm[1]?.value ?? '6.28');
  const lastUpdated = sorted30[0]?.date ?? new Date().toISOString().split('T')[0];

  const chartData30 = [...data30].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const chartData15 = [...data15].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const chartDataArm = [...dataArm].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RefiRateBoard',
    url: 'https://refi-rate-board.vercel.app',
    description: "Compare today's mortgage refinance rates from top lenders.",
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://refi-rate-board.vercel.app/en/lenders',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Should I refinance my mortgage in 2026?',
        acceptedAnswer: { '@type': 'Answer', text: 'Refinancing makes sense if you can lower your rate by at least 0.5%-1% and recoup closing costs before moving.' },
      },
      {
        '@type': 'Question',
        name: 'What is the current 30-year refinance rate?',
        acceptedAnswer: { '@type': 'Answer', text: `The current national average 30-year refinance rate is approximately ${rate30.toFixed(2)}% as of ${lastUpdated}.` },
      },
    ],
  };

  return (
    <>
      <SchemaLD schema={websiteSchema} />
      <SchemaLD schema={faqSchema} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-700 to-teal-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-cyan-200 text-lg mb-2">
            {t('subtitle', { count: lenders.length })}
          </p>
          <p className="text-cyan-300 text-sm">
            {t('asOf')} {lastUpdated} · {t('source')}
          </p>
        </div>
      </section>

      {/* Rate Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RateCard label="30-Year Fixed Refi" rate={rate30} previousRate={prevRate30} lastUpdated={lastUpdated} color="cyan" />
          <RateCard label="15-Year Fixed Refi" rate={rate15} previousRate={prevRate15} lastUpdated={lastUpdated} color="teal" />
          <RateCard label="5/1 ARM Refi" rate={rateArm} previousRate={prevRateArm} lastUpdated={lastUpdated} color="blue" />
          <RateCard label="Cash-Out Refi" rate={rateCashOut} lastUpdated={lastUpdated} color="emerald" />
        </div>
      </section>

      {/* Native Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdNativeBanner />
      </div>

      {/* Chart */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <RateChart
          data30={chartData30}
          data15={chartData15}
          dataArm={chartDataArm}
          title="90-Day Refi Rate Trend · Source: Federal Reserve Economic Data (FRED)"
        />
      </section>

      {/* Display Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdDisplay />
      </div>

      {/* Lender Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <LenderTable lenders={lenders} locale={locale} />
      </section>

      {/* Should I Refi Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Should You Refinance?</h2>
          <p className="text-gray-600 mb-6">Use our free calculator to see your monthly savings and break-even point.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: '📉', title: 'Lower Your Rate', desc: `Current avg: ${rate30.toFixed(2)}% — if you have a higher rate, it may be time to refi` },
              { icon: '💰', title: 'Cash-Out Options', desc: `Tap your home equity at ${rateCashOut.toFixed(2)}% for improvements or debt consolidation` },
              { icon: '⏱️', title: 'Break-Even Analysis', desc: 'See exactly how many months to recoup your closing costs' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <a
            href={`/${locale}/calculator`}
            className="inline-block bg-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-cyan-700 transition-colors"
          >
            Calculate My Savings →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <FAQSection />
      </div>
    </>
  );
}
