import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SchemaLD } from '@/components/SchemaLD';
import { getLenders } from '@/lib/lenders';
import { routing } from '@/i18n/routing';
import { ExternalLink, TrendingDown } from 'lucide-react';

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
    title: t('lendersTitle'),
    description: 'Compare refinance rates from top U.S. lenders including Better Mortgage, Rocket Mortgage, SoFi, PennyMac, and more.',
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/lenders`])),
    },
  };
}

export default async function LendersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lenders = await getLenders();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://refi-rate-board.vercel.app/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Lenders', item: `https://refi-rate-board.vercel.app/${locale}/lenders` },
    ],
  };

  const sorted = [...lenders].sort((a, b) => a.refi30yr - b.refi30yr);

  return (
    <>
      <SchemaLD schema={schema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Home', href: '' }, { label: 'Refi Lenders' }]} locale={locale} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Compare Refinance Lenders</h1>
          <p className="text-gray-500 mt-2">Side-by-side refi rate comparison from top U.S. lenders. Rates updated daily.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((lender) => (
            <div key={lender.slug} className="bg-white rounded-xl border border-cyan-100 shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-2xl">{lender.logo}</span>
                  <h2 className="font-bold text-gray-900 mt-1">{lender.name}</h2>
                  <p className="text-xs text-gray-400">Min. credit: {lender.minCredit} · Min. equity: {lender.minEquity}%</p>
                </div>
                <span className="bg-cyan-50 text-cyan-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {lender.refi30yr.toFixed(3)}% 30yr
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-gray-500 text-xs">15yr Refi</p>
                  <p className="font-bold text-gray-900">{lender.refi15yr.toFixed(3)}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-gray-500 text-xs">Cash-Out</p>
                  <p className="font-bold text-gray-900">{lender.cashOutRate.toFixed(3)}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-gray-500 text-xs">VA IRRRL</p>
                  <p className="font-bold text-gray-900">{lender.vaRefi.toFixed(3)}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-gray-500 text-xs">FHA Streamline</p>
                  <p className="font-bold text-gray-900">{lender.fhaRefi.toFixed(3)}%</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/${locale}/lenders/${lender.slug}`}
                  className="flex-1 text-center text-sm bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center gap-1"
                >
                  <TrendingDown className="w-4 h-4" />
                  View Details
                </Link>
                {lender.applyUrl && (
                  <a
                    href={lender.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1 text-gray-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
