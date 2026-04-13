import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SchemaLD } from '@/components/SchemaLD';
import { routing } from '@/i18n/routing';
import statesData from '@/data/states-fallback.json';

type State = { name: string; slug: string; abbr: string; avgRefi30yr: number; closingCostEstimate: number };

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
    title: t('statesTitle'),
    description: 'Compare current refinance rates in all 50 U.S. states. Find the best 30-year, 15-year, and cash-out refi rates available in your state.',
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/states`])),
    },
  };
}

export default async function StatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const states = statesData as State[];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://refi-rate-board.vercel.app/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Refi Rates by State', item: `https://refi-rate-board.vercel.app/${locale}/states` },
    ],
  };

  return (
    <>
      <SchemaLD schema={schema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Home', href: '' }, { label: 'Refi Rates by State' }]} locale={locale} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Refinance Rates by State</h1>
          <p className="text-gray-500 mt-2">Find current refi rates and estimated closing costs in your state.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {states.map((state) => (
            <Link
              key={state.slug}
              href={`/${locale}/states/${state.slug}`}
              className="bg-white rounded-xl border border-cyan-100 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all p-4 text-center group"
            >
              <div className="w-10 h-10 bg-cyan-50 text-cyan-700 rounded-lg flex items-center justify-center font-bold text-sm mx-auto mb-2 group-hover:bg-cyan-100">
                {state.abbr}
              </div>
              <p className="text-sm font-medium text-gray-800 group-hover:text-cyan-700">{state.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{state.avgRefi30yr.toFixed(2)}%</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
