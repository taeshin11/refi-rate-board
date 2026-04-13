import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SchemaLD } from '@/components/SchemaLD';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { getLenders } from '@/lib/lenders';
import { fetchFredSeries } from '@/lib/fred';
import statesData from '@/data/states-fallback.json';
import { ExternalLink } from 'lucide-react';

type State = { name: string; slug: string; abbr: string; avgRefi30yr: number; avgRefi15yr: number; closingCostEstimate: number };

export async function generateStaticParams() {
  const states = statesData as State[];
  return routing.locales.flatMap((locale) =>
    states.map((state) => ({ locale, state: state.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; state: string }>;
}): Promise<Metadata> {
  const { locale, state: stateSlug } = await params;
  const states = statesData as State[];
  const stateData = states.find((s) => s.slug === stateSlug);
  if (!stateData) return {};

  return {
    title: `${stateData.name} Refinance Rates — Best Refi Deals (April 2026) | RefiRateBoard`,
    description: `Compare today's refinance rates in ${stateData.name}. Average 30-year refi rate: ${stateData.avgRefi30yr}%. Find top lenders and estimated closing costs in ${stateData.abbr}.`,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/states/${stateSlug}`])),
    },
  };
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ locale: string; state: string }>;
}) {
  const { locale, state: stateSlug } = await params;
  const states = statesData as State[];
  const stateData = states.find((s) => s.slug === stateSlug);

  if (!stateData) notFound();

  const [lenders, data30] = await Promise.all([
    getLenders(),
    fetchFredSeries('MORTGAGE30US', 4),
  ]);

  const availableLenders = lenders; // all lenders are nationwide
  const sorted = [...data30].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const nationalRate = parseFloat(sorted[0]?.value ?? '6.875');
  const lastUpdated = sorted[0]?.date ?? new Date().toISOString().split('T')[0];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://refi-rate-board.vercel.app/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'States', item: `https://refi-rate-board.vercel.app/${locale}/states` },
      { '@type': 'ListItem', position: 3, name: stateData.name },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the average refinance rate in ${stateData.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The average 30-year refinance rate in ${stateData.name} is approximately ${stateData.avgRefi30yr}%. The national average is ${nationalRate.toFixed(2)}%.`,
        },
      },
      {
        '@type': 'Question',
        name: `What are typical refinance closing costs in ${stateData.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Estimated refinance closing costs in ${stateData.name} are approximately $${stateData.closingCostEstimate.toLocaleString()}, depending on loan amount and lender.`,
        },
      },
    ],
  };

  return (
    <>
      <SchemaLD schema={schema} />
      <SchemaLD schema={faqSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '' },
            { label: 'States', href: '/states' },
            { label: stateData.name },
          ]}
          locale={locale}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{stateData.name} Refinance Rates</h1>
          <p className="text-gray-500 mt-2">
            Compare today&apos;s refi rates in {stateData.name} ({stateData.abbr}). Updated {lastUpdated}.
          </p>
        </div>

        {/* Rate overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl p-6">
            <p className="text-cyan-200 text-sm">Avg. 30-Year Refi Rate</p>
            <p className="text-4xl font-bold mt-1">{stateData.avgRefi30yr.toFixed(2)}%</p>
            <p className="text-cyan-300 text-xs mt-1">State average · {stateData.abbr}</p>
          </div>
          <div className="bg-white rounded-xl border border-cyan-100 shadow-sm p-6">
            <p className="text-gray-500 text-sm">Avg. 15-Year Refi Rate</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">{stateData.avgRefi15yr.toFixed(2)}%</p>
            <p className="text-gray-400 text-xs mt-1">State average · {stateData.abbr}</p>
          </div>
          <div className="bg-white rounded-xl border border-cyan-100 shadow-sm p-6">
            <p className="text-gray-500 text-sm">Est. Closing Costs</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">${stateData.closingCostEstimate.toLocaleString()}</p>
            <p className="text-gray-400 text-xs mt-1">Typical range in {stateData.abbr}</p>
          </div>
        </div>

        {/* National vs State */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-5 mb-8">
          <p className="text-sm text-cyan-800">
            <strong>{stateData.name}</strong> refi rates ({stateData.avgRefi30yr.toFixed(2)}%) are{' '}
            {stateData.avgRefi30yr > nationalRate
              ? <span className="text-red-600 font-semibold">{(stateData.avgRefi30yr - nationalRate).toFixed(2)}% above</span>
              : <span className="text-emerald-600 font-semibold">{(nationalRate - stateData.avgRefi30yr).toFixed(2)}% below</span>
            }{' '}
            the national average ({nationalRate.toFixed(2)}%). Source: FRED · Updated {lastUpdated}.
          </p>
        </div>

        {/* Lender list */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Top Refi Lenders in {stateData.name} ({availableLenders.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {availableLenders.sort((a, b) => a.refi30yr - b.refi30yr).map((lender) => (
            <div key={lender.slug} className="bg-white rounded-xl border border-cyan-100 shadow-sm p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span>{lender.logo}</span>
                  <Link href={`/${locale}/lenders/${lender.slug}`} className="font-semibold text-cyan-700 hover:text-cyan-900">
                    {lender.name}
                  </Link>
                </div>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>30yr: <strong className="text-gray-900">{lender.refi30yr.toFixed(3)}%</strong></span>
                  <span>15yr: <strong className="text-gray-900">{lender.refi15yr.toFixed(3)}%</strong></span>
                  <span>Cash-out: <strong className="text-gray-900">{lender.cashOutRate.toFixed(3)}%</strong></span>
                </div>
              </div>
              {lender.applyUrl && (
                <a
                  href={lender.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs bg-cyan-600 text-white px-3 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Apply <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* State-specific tips */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Refinancing Tips for {stateData.name} Homeowners</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Average closing costs in {stateData.abbr} are approximately ${stateData.closingCostEstimate.toLocaleString()} — factor this into your break-even calculation.</li>
            <li>• With a 30-year refi rate of {stateData.avgRefi30yr.toFixed(2)}%, homeowners who locked in rates above 7.5% may save significantly by refinancing.</li>
            <li>• {stateData.name} has no special state tax on mortgage refinancing — check with your tax advisor for deductibility of points and fees.</li>
            <li>• VA IRRRL and FHA streamline refinances require less documentation and no new appraisal in most cases, making them faster to close.</li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ: Refinancing in {stateData.name}</h2>
          <div className="space-y-4">
            {[
              {
                q: `What is the average refinance rate in ${stateData.name}?`,
                a: `The average 30-year refinance rate in ${stateData.name} is approximately ${stateData.avgRefi30yr}%, compared to the national average of ${nationalRate.toFixed(2)}%.`,
              },
              {
                q: `How much are refinance closing costs in ${stateData.name}?`,
                a: `Estimated refinance closing costs in ${stateData.name} are approximately $${stateData.closingCostEstimate.toLocaleString()}. This typically includes origination fees, appraisal, title insurance, and government recording fees.`,
              },
              {
                q: `How long does it take to refinance in ${stateData.name}?`,
                a: `A typical refinance in ${stateData.name} takes 30-45 days from application to closing. VA IRRRL and FHA streamline refinances may close faster due to reduced documentation requirements.`,
              },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-xl border border-cyan-100 shadow-sm">
                <summary className="p-5 font-semibold text-gray-800 cursor-pointer hover:text-cyan-700 list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-gray-400 text-lg ml-4">+</span>
                </summary>
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href={`/${locale}/states`} className="text-cyan-600 hover:text-cyan-800 text-sm">
            ← Back to all states
          </Link>
        </div>
      </div>
    </>
  );
}
