import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SchemaLD } from '@/components/SchemaLD';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { fetchFredSeries } from '@/lib/fred';
import { getLenders } from '@/lib/lenders';
import loanTypesData from '@/data/loan-types.json';
import { Check, X } from 'lucide-react';

type LoanType = { slug: string; name: string; key: string; description: string };

export async function generateStaticParams() {
  const loanTypes = loanTypesData as LoanType[];
  return routing.locales.flatMap((locale) =>
    loanTypes.map((lt) => ({ locale, type: lt.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}): Promise<Metadata> {
  const { locale, type } = await params;
  const loanTypes = loanTypesData as LoanType[];
  const loanType = loanTypes.find((lt) => lt.slug === type);
  if (!loanType) return {};

  return {
    title: `${loanType.name} Rates Today (April 2026) | RefiRateBoard`,
    description: `Current ${loanType.name} rates. ${loanType.description} Compare rates from top refi lenders.`,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/loan-types/${type}`])),
    },
  };
}

const typeDetails: Record<string, { pros: string[]; cons: string[]; bestFor: string; minDown: string; minCredit: string; fullDesc: string }> = {
  'rate-and-term': {
    pros: ['Lower interest rate', 'Reduce loan term', 'No cash taken out', 'Potentially remove PMI'],
    cons: ['Closing costs required', 'Break-even period applies', 'Must qualify for new loan'],
    bestFor: 'Homeowners who want to lower their rate or switch from ARM to fixed',
    minDown: 'N/A (equity-based)',
    minCredit: '620',
    fullDesc: 'A rate-and-term refinance replaces your existing mortgage with a new one that has a better interest rate, shorter term, or both. No cash is taken out. This is the most common type of refinancing and is ideal when rates drop, allowing you to save on monthly payments or pay off your home faster without increasing your loan balance.',
  },
  'cash-out': {
    pros: ['Access home equity as cash', 'Tax-deductible if used for improvements', 'Lower rate than personal loans', 'Consolidate high-interest debt'],
    cons: ['Higher rate than rate-term refi', 'Increases loan balance', 'Risk of foreclosure if unable to pay', 'Closing costs apply'],
    bestFor: 'Homeowners with significant equity who need funds for home improvements or debt consolidation',
    minDown: 'N/A (20% equity required after)',
    minCredit: '640',
    fullDesc: 'Cash-out refinancing lets you replace your existing mortgage with a larger one and take the difference as cash. Lenders typically allow you to borrow up to 80% of your home\'s value. This is useful for major home improvements, debt consolidation, or other significant expenses. Rates are typically 0.125%-0.5% higher than rate-and-term refi rates.',
  },
  'fha-streamline': {
    pros: ['No appraisal required (usually)', 'Less documentation', 'Lower credit requirements', 'Reduced mortgage insurance'],
    cons: ['Must have existing FHA loan', 'Cannot take cash out', 'Net tangible benefit required', 'MIP still applies'],
    bestFor: 'Existing FHA loan holders who want to lower their rate quickly with minimal paperwork',
    minDown: 'N/A',
    minCredit: '580',
    fullDesc: 'FHA Streamline Refinance is available exclusively to homeowners with existing FHA loans. It requires minimal documentation — no income verification or appraisal in most cases. To qualify, your refinance must provide a "net tangible benefit" such as lowering your payment by at least 5%. This is one of the fastest and easiest ways to refinance.',
  },
  'va-irrrl': {
    pros: ['No appraisal required (usually)', 'No out-of-pocket costs possible', 'Lowest refi rates available', 'Minimal paperwork', 'No income verification'],
    cons: ['Must have existing VA loan', 'VA funding fee applies (unless exempt)', 'Cannot take cash out', 'Must show net tangible benefit'],
    bestFor: 'Eligible veterans and service members with existing VA loans seeking lower rates',
    minDown: 'N/A',
    minCredit: '580',
    fullDesc: 'The VA Interest Rate Reduction Refinance Loan (IRRRL) is exclusively for veterans, active duty, and eligible surviving spouses who already have a VA loan. It offers some of the lowest refinance rates available, requires minimal paperwork, and typically does not require a new appraisal or credit underwriting. The VA funding fee can often be rolled into the loan.',
  },
  'conventional': {
    pros: ['No PMI with 20% equity', 'Competitive rates', 'No upfront mortgage insurance', 'Flexible loan terms'],
    cons: ['620+ credit score required', 'Higher rates with lower credit', 'Stricter debt-to-income limits'],
    bestFor: 'Borrowers with good credit and significant equity seeking the best rates',
    minDown: 'N/A (20% equity preferred)',
    minCredit: '620',
    fullDesc: 'A conventional refinance is not backed by the government (unlike FHA or VA loans). It offers flexible terms and competitive rates, especially for borrowers with 740+ credit scores and 20%+ equity. Borrowers with less than 20% equity will typically need to pay PMI unless using a no-PMI loan program.',
  },
  'jumbo-refi': {
    pros: ['Competitive rates for large balances', 'Flexible loan structures', 'Can lower high-balance loan rates'],
    cons: ['Stricter underwriting', '720+ credit score often required', 'Larger down payment/equity needed', 'More documentation required'],
    bestFor: 'Homeowners with loan balances above $806,500 (conforming limit) seeking better rates',
    minDown: 'N/A (25-30% equity typical)',
    minCredit: '720',
    fullDesc: 'Jumbo refinancing applies to loans that exceed the conforming loan limit ($806,500 in most U.S. counties in 2026). These loans require stricter credit and equity standards but can offer competitive rates for large loan balances. Jumbo loans are not eligible for purchase by Fannie Mae or Freddie Mac.',
  },
  '15-year-refi': {
    pros: ['Lower interest rate than 30yr', 'Build equity twice as fast', 'Significant total interest savings', 'Debt-free sooner'],
    cons: ['Higher monthly payment', 'Less monthly cash flow', 'Tighter debt-to-income ratio', 'Less financial flexibility'],
    bestFor: 'Borrowers with higher income who want to pay off their home faster and minimize total interest',
    minDown: 'N/A',
    minCredit: '620',
    fullDesc: 'Refinancing to a 15-year term typically offers a lower interest rate than a 30-year loan and dramatically reduces total interest paid over the life of the loan. While monthly payments are higher, you build equity faster and own your home outright in half the time. This is ideal for homeowners later in their careers with stable income.',
  },
};

export default async function LoanTypePage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale, type } = await params;
  const loanTypes = loanTypesData as LoanType[];
  const loanType = loanTypes.find((lt) => lt.slug === type);

  if (!loanType) notFound();

  const details = typeDetails[type] ?? typeDetails['rate-and-term'];

  const seriesId = type === '15-year-refi' ? 'MORTGAGE15US' : 'MORTGAGE30US';
  const [seriesData, lenders] = await Promise.all([
    fetchFredSeries(seriesId, 4),
    getLenders(),
  ]);

  const sorted = [...seriesData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const baseRate = parseFloat(sorted[0]?.value ?? '6.875');
  const rateAdjust: Record<string, number> = {
    'cash-out': 0.25,
    'fha-streamline': -0.25,
    'va-irrrl': -0.5,
    'jumbo-refi': 0.125,
  };
  const currentRate = parseFloat((baseRate + (rateAdjust[type] ?? 0)).toFixed(3));
  const lastUpdated = sorted[0]?.date ?? new Date().toISOString().split('T')[0];

  const rateKey = loanType.key as keyof (typeof lenders)[0];
  const topLenders = [...lenders]
    .sort((a, b) => (a[rateKey] as number) - (b[rateKey] as number))
    .slice(0, 5);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: `${loanType.name}`,
    description: loanType.description,
    annualPercentageRate: currentRate,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `https://refi-rate-board.vercel.app/${locale}` },
        { '@type': 'ListItem', position: 2, name: 'Loan Types', item: `https://refi-rate-board.vercel.app/${locale}/loan-types` },
        { '@type': 'ListItem', position: 3, name: loanType.name },
      ],
    },
  };

  return (
    <>
      <SchemaLD schema={schema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '' },
            { label: 'Loan Types', href: '/loan-types' },
            { label: loanType.name },
          ]}
          locale={locale}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{loanType.name} — Today&apos;s Rates</h1>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-5xl font-bold text-cyan-700">{currentRate.toFixed(3)}%</span>
            <span className="text-gray-500">Current avg · Updated {lastUpdated}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Description */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">What is a {loanType.name}?</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{details.fullDesc}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5" /> Pros
                </h3>
                <ul className="space-y-2">
                  {details.pros.map((pro, i) => (
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
                  {details.cons.map((con, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Quick facts */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Facts</h2>
            <div className="space-y-3">
              <div className="bg-cyan-50 rounded-lg p-3">
                <p className="text-xs text-cyan-600">Current Rate</p>
                <p className="text-xl font-bold text-cyan-700">{currentRate.toFixed(3)}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Min. Credit Score</p>
                <p className="font-bold text-gray-900">{details.minCredit}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Equity Requirement</p>
                <p className="font-bold text-gray-900">{details.minDown}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600">Best For</p>
                <p className="text-sm text-gray-700 mt-1">{details.bestFor}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top lenders */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Lenders for {loanType.name}</h2>
          <div className="bg-white rounded-xl border border-cyan-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-cyan-50 border-b border-cyan-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Lender</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{loanType.name} Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">APR</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-50">
                {topLenders.map((lender, i) => {
                  const rate = lender[rateKey] as number;
                  return (
                    <tr key={lender.slug} className={i % 2 === 0 ? 'bg-white' : 'bg-cyan-50/30'}>
                      <td className="px-4 py-4">
                        <Link href={`/${locale}/lenders/${lender.slug}`} className="font-medium text-cyan-700 hover:text-cyan-900 flex items-center gap-2">
                          <span>{lender.logo}</span>
                          {lender.name}
                        </Link>
                      </td>
                      <td className="px-4 py-4 font-bold text-gray-900">{rate.toFixed(3)}%</td>
                      <td className="px-4 py-4 text-gray-600">{(rate + 0.15).toFixed(3)}%</td>
                      <td className="px-4 py-4">
                        {lender.applyUrl && (
                          <a href={lender.applyUrl} target="_blank" rel="noopener noreferrer"
                            className="text-xs bg-cyan-600 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-700">
                            Apply
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <Link href={`/${locale}/loan-types`} className="text-cyan-600 hover:text-cyan-800 text-sm">
            ← Back to all loan types
          </Link>
        </div>
      </div>
    </>
  );
}
