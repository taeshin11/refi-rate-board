import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SchemaLD } from '@/components/SchemaLD';
import { routing } from '@/i18n/routing';
import { fetchFredSeries } from '@/lib/fred';
import loanTypesData from '@/data/loan-types.json';

type LoanType = { slug: string; name: string; key: string; description: string };

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: 'Refinance Loan Types — Rate-Term, Cash-Out, FHA Streamline, VA IRRRL | RefiRateBoard',
    description: 'Compare all refinance loan types. Learn about rate-and-term, cash-out, FHA streamline, VA IRRRL, jumbo, and 15-year refinancing options.',
  };
}

const loanTypeIcons: Record<string, string> = {
  'rate-and-term': '📉',
  'cash-out': '💰',
  'fha-streamline': '🏛',
  'va-irrrl': '⭐',
  'conventional': '🏠',
  'jumbo-refi': '🏰',
  '15-year-refi': '⚡',
};

export default async function LoanTypesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loanTypes = loanTypesData as LoanType[];

  const [data30, data15] = await Promise.all([
    fetchFredSeries('MORTGAGE30US', 2),
    fetchFredSeries('MORTGAGE15US', 2),
  ]);

  const getLatestRate = (data: { date: string; value: string }[], fallback: number) => {
    const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return parseFloat(sorted[0]?.value ?? String(fallback));
  };

  const rate30 = getLatestRate(data30, 6.875);
  const rate15 = getLatestRate(data15, 6.125);

  const rateMap: Record<string, number> = {
    'rate-and-term': rate30,
    'cash-out': parseFloat((rate30 + 0.25).toFixed(3)),
    'fha-streamline': parseFloat((rate30 - 0.25).toFixed(3)),
    'va-irrrl': parseFloat((rate30 - 0.5).toFixed(3)),
    'conventional': rate30,
    'jumbo-refi': parseFloat((rate30 + 0.125).toFixed(3)),
    '15-year-refi': rate15,
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://refi-rate-board.vercel.app/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Refi Loan Types', item: `https://refi-rate-board.vercel.app/${locale}/loan-types` },
    ],
  };

  return (
    <>
      <SchemaLD schema={schema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Home', href: '' }, { label: 'Refi Loan Types' }]} locale={locale} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Refinance Loan Types</h1>
          <p className="text-gray-500 mt-2">Compare different refinance options to find what works best for your situation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loanTypes.map((loanType) => {
            const rate = rateMap[loanType.slug] ?? rate30;
            const icon = loanTypeIcons[loanType.slug] ?? '📊';
            return (
              <div key={loanType.slug} className="bg-white rounded-xl border border-cyan-100 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{icon}</span>
                  <div>
                    <h2 className="font-bold text-gray-900">{loanType.name}</h2>
                    <p className="text-2xl font-bold text-cyan-700">{rate.toFixed(3)}%</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{loanType.description}</p>
                <Link
                  href={`/${locale}/loan-types/${loanType.slug}`}
                  className="block text-center text-sm bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
