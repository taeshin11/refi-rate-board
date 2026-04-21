import { Breadcrumb } from '@/components/Breadcrumb';
import { routing } from '@/i18n/routing';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'About RefiRateBoard — Daily Refinance Rate Tracker',
  description:
    'RefiRateBoard tracks daily mortgage refinance rates from top U.S. lenders, helping homeowners decide when to refinance and compare 30-year, 15-year, cash-out, and rate-and-term refi options.',
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Home', href: '' }, { label: 'About' }]} locale={locale} />

      <h1 className="text-3xl font-bold text-gray-900 mb-3">About RefiRateBoard</h1>
      <p className="text-gray-500 text-sm mb-8">Helping homeowners make smarter refinancing decisions since 2024.</p>

      {/* Mission */}
      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200 rounded-2xl p-6 mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          RefiRateBoard is a free, independent mortgage refinance rate tracker built to give homeowners a clear, unbiased
          view of today&apos;s refi landscape. We aggregate daily rate data from the Federal Reserve Economic Data (FRED)
          and major U.S. lenders so you can quickly see where rates stand — and whether now is the right time to refinance.
        </p>
      </div>

      {/* What we track */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Track</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: '30-Year Fixed Refinance',
              desc: 'The most popular refinance option. We track the national average 30-year fixed refi rate daily, updated from FRED mortgage data.',
            },
            {
              title: '15-Year Fixed Refinance',
              desc: 'Shorter term, lower rate. Ideal for homeowners who can afford higher monthly payments and want to pay off their mortgage faster.',
            },
            {
              title: 'Cash-Out Refinance',
              desc: 'Tap your home equity. We show indicative cash-out rates so you can gauge the cost of borrowing against your home\'s value.',
            },
            {
              title: 'Rate-and-Term Refinance',
              desc: 'Change your rate or loan term without taking cash out — the most straightforward refinance type for lowering your monthly payment.',
            },
          ].map((item) => (
            <div key={item.title} className="card">
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lender coverage */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lender Coverage</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          We profile the largest mortgage refinance lenders in the United States — including national banks, credit unions,
          online lenders, and mortgage-specific companies. For each lender, we show key details like minimum credit score
          requirements, loan types offered, and direct links to apply.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Our lender data is reviewed regularly to ensure accuracy. We do not accept payment from lenders to influence
          rankings or ratings. All lender profiles are provided for informational comparison purposes only.
        </p>
      </section>

      {/* Data sources */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sources</h2>
        <div className="space-y-3">
          {[
            {
              source: 'Federal Reserve Economic Data (FRED)',
              detail: 'Published by the Federal Reserve Bank of St. Louis. We use MORTGAGE30US, MORTGAGE15US, and MORTGAGE5US series — the gold standard for U.S. mortgage rate benchmarks.',
            },
            {
              source: 'Major U.S. Lender Rate Sheets',
              detail: 'Indicative rates from top lenders including Rocket Mortgage, LoanDepot, Better, Chase, Wells Fargo, and others are sourced from publicly available rate information.',
            },
            {
              source: 'HUD & CFPB Resources',
              detail: 'Regulatory guidance and consumer protection information is sourced from the U.S. Department of Housing and Urban Development and the Consumer Financial Protection Bureau.',
            },
          ].map((item) => (
            <div key={item.source} className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{item.source}</h3>
              <p className="text-sm text-gray-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Free Tools for Homeowners</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Break-Even Calculator', desc: 'Calculate exactly how many months it takes to recoup your refinancing closing costs.', href: `/${locale}/calculator` },
            { title: 'Rate Trend Chart', desc: '90-day chart showing how 30-yr, 15-yr, and ARM refinance rates have moved.', href: `/${locale}` },
            { title: 'State Rate Explorer', desc: 'Browse refinance conditions and lender availability by state.', href: `/${locale}/states` },
          ].map((tool) => (
            <Link key={tool.title} href={tool.href} className="card hover:border-cyan-300 transition-colors group">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-cyan-700">{tool.title}</h3>
              <p className="text-sm text-gray-600">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Disclosure */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-500 leading-relaxed">
        <p className="font-semibold text-gray-700 mb-2">Disclaimer</p>
        <p>
          RefiRateBoard is not a mortgage lender, broker, or financial advisor. Rates displayed are for informational
          and comparison purposes only and are not offers to lend. Always consult a licensed mortgage professional or a
          HUD-approved housing counselor before making refinancing decisions. Refinancing involves costs and risks,
          including closing costs and potential extension of your loan term.
        </p>
      </div>
    </div>
  );
}
