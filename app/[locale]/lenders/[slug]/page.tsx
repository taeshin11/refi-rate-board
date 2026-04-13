import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SchemaLD } from '@/components/SchemaLD';
import { RefiCalculator } from '@/components/RefiCalculator';
import { AdDisplay } from '@/components/AdDisplay';
import { getLenders, getLenderBySlug } from '@/lib/lenders';
import { fetchFredSeries } from '@/lib/fred';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { ExternalLink, TrendingDown, TrendingUp, Check, X } from 'lucide-react';

export async function generateStaticParams() {
  const lenders = await getLenders();
  return routing.locales.flatMap((locale) =>
    lenders.map((lender) => ({ locale, slug: lender.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lender = await getLenderBySlug(slug);
  if (!lender) return {};

  return {
    title: `${lender.name} Refi Rates (April 2026): 30yr, 15yr, Cash-Out | RefiRateBoard`,
    description: `Compare ${lender.name} refinance rates. Current 30-year refi at ${lender.refi30yr}%, 15-year at ${lender.refi15yr}%. Cash-out, VA IRRRL, and FHA streamline available.`,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/lenders/${slug}`])),
    },
  };
}

const lenderProsConsMap: Record<string, { pros: string[]; cons: string[] }> = {
  'better-mortgage': {
    pros: ['100% online process', 'No origination fee', 'Instant loan estimate', 'Fast closings'],
    cons: ['No physical branches', 'Limited loan options'],
  },
  'rocket-mortgage': {
    pros: ['Easy digital application', 'Fast pre-approval', 'Wide loan variety', 'Strong customer support'],
    cons: ['Rates may be higher than competitors', 'Origination fees apply'],
  },
  'sofi': {
    pros: ['No origination fees', 'Member discounts', 'Competitive rates', 'Fast online process'],
    cons: ['Membership required', 'Limited state availability'],
  },
  'loandepot': {
    pros: ['Lifetime guarantee on closing costs', 'Fast online process', 'Wide product range'],
    cons: ['Origination fee applies', 'Rates vary by state'],
  },
  'pennymac': {
    pros: ['Competitive refi rates', 'Strong VA specialty', 'Nationwide lender'],
    cons: ['Primarily online', 'Service varies by region'],
  },
};

export default async function LenderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const lender = await getLenderBySlug(slug);

  if (!lender) notFound();

  const data30 = await fetchFredSeries('MORTGAGE30US', 4);
  const sorted = [...data30].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const currentNational = parseFloat(sorted[0]?.value ?? '6.82');
  const diff30 = parseFloat((lender.refi30yr - currentNational).toFixed(3));

  const prosCons = lenderProsConsMap[slug] || {
    pros: ['Competitive refinance rates', 'Multiple loan types', 'Nationwide availability', 'Online application'],
    cons: ['Terms vary by credit profile', 'Closing costs apply'],
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: `${lender.name} Refinance`,
    provider: { '@type': 'Organization', name: lender.name },
    annualPercentageRate: lender.refi30yr,
    description: `${lender.name} offers refinance rates starting at ${lender.refi30yr}% for 30-year fixed.`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `https://refi-rate-board.vercel.app/${locale}` },
        { '@type': 'ListItem', position: 2, name: 'Lenders', item: `https://refi-rate-board.vercel.app/${locale}/lenders` },
        { '@type': 'ListItem', position: 3, name: lender.name },
      ],
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${lender.name}'s current refinance rate?`,
        acceptedAnswer: { '@type': 'Answer', text: `${lender.name}'s current 30-year refi rate is ${lender.refi30yr}%, 15-year is ${lender.refi15yr}%, and cash-out rate is ${lender.cashOutRate}%.` },
      },
      {
        '@type': 'Question',
        name: `How does ${lender.name}'s refi rate compare to the national average?`,
        acceptedAnswer: { '@type': 'Answer', text: `${lender.name}'s 30-year refi rate of ${lender.refi30yr}% is ${Math.abs(diff30).toFixed(3)}% ${diff30 > 0 ? 'above' : 'below'} the national average of ${currentNational}%.` },
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
            { label: 'Lenders', href: '/lenders' },
            { label: lender.name },
          ]}
          locale={locale}
        />

        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{lender.logo}</span>
              <h1 className="text-3xl font-bold text-gray-900">{lender.name} Refinance Rates</h1>
            </div>
            <p className="text-gray-500">
              Min. credit score: <strong>{lender.minCredit}</strong> · Min. equity: <strong>{lender.minEquity}%</strong>
            </p>
          </div>
          {lender.applyUrl && (
            <a
              href={lender.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
            >
              Apply Now
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Rate Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {[
            { label: '30-Year Refi', rate: lender.refi30yr, highlight: true },
            { label: '15-Year Refi', rate: lender.refi15yr },
            { label: 'Cash-Out Refi', rate: lender.cashOutRate },
            { label: 'Jumbo Refi', rate: lender.jumboRate },
            { label: 'VA IRRRL', rate: lender.vaRefi },
            { label: 'FHA Streamline', rate: lender.fhaRefi },
          ].map((item) => (
            <div
              key={item.label}
              className={`bg-white rounded-xl border ${item.highlight ? 'border-cyan-400 ring-1 ring-cyan-200' : 'border-gray-200'} shadow-sm p-4 text-center`}
            >
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className={`text-xl font-bold ${item.highlight ? 'text-cyan-700' : 'text-gray-900'}`}>
                {item.rate.toFixed(3)}%
              </p>
              <p className="text-xs text-gray-400 mt-1">APR {(item.rate + 0.15).toFixed(3)}%</p>
            </div>
          ))}
        </div>

        {/* vs National Average */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">vs. National Average</h2>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-32 bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">National Avg (30yr)</p>
              <p className="text-2xl font-bold text-gray-900">{currentNational.toFixed(3)}%</p>
            </div>
            <div className={`flex-1 min-w-32 rounded-lg p-4 text-center ${diff30 <= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <p className="text-sm text-gray-500">{lender.name} Difference</p>
              <p className={`text-2xl font-bold flex items-center justify-center gap-1 ${diff30 <= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {diff30 <= 0 ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                {diff30 > 0 ? '+' : ''}{diff30.toFixed(3)}%
              </p>
            </div>
          </div>
        </div>

        {/* Pros/Cons */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{lender.name} Pros &amp; Cons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5" /> Pros
              </h3>
              <ul className="space-y-2">
                {prosCons.pros.map((pro, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                <X className="w-5 h-5" /> Cons
              </h3>
              <ul className="space-y-2">
                {prosCons.cons.map((con, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <AdDisplay />

        {/* Mini Refi Calculator */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Calculate Your Savings with {lender.name}</h2>
          <RefiCalculator defaultNewRate={lender.refi30yr} />
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: `What is ${lender.name}'s current refinance rate?`,
                a: `${lender.name}'s current 30-year refi rate is ${lender.refi30yr}%, 15-year is ${lender.refi15yr}%, and cash-out rate is ${lender.cashOutRate}%. Rates may vary based on credit score and loan amount.`,
              },
              {
                q: `What credit score do I need to refinance with ${lender.name}?`,
                a: `${lender.name} requires a minimum credit score of ${lender.minCredit} for most refinance products. Higher scores qualify for better rates.`,
              },
              {
                q: `Does ${lender.name} offer cash-out refinancing?`,
                a: `Yes, ${lender.name} offers cash-out refinancing at ${lender.cashOutRate}% for qualified borrowers with at least ${lender.minEquity}% equity remaining after the refinance.`,
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
          <Link href={`/${locale}/lenders`} className="text-cyan-600 hover:text-cyan-800 text-sm">
            ← Back to all lenders
          </Link>
        </div>
      </div>
    </>
  );
}
