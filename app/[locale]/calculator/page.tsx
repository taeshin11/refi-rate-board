import { RefiCalculator } from '@/components/RefiCalculator';
import { SchemaLD } from '@/components/SchemaLD';
import { routing } from '@/i18n/routing';
import { fetchFredSeries } from '@/lib/fred';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Refinance Calculator — Monthly Savings & Break-Even Analysis | RefiRateBoard',
  description: 'Free refinance calculator. See your monthly savings, break-even point, and lifetime savings. Compare your current rate vs. today\'s best refi rates.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Refinance Break-Even Calculator',
  description: 'Calculate monthly savings, break-even months, and lifetime savings from refinancing',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0' },
};

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const data30 = await fetchFredSeries('MORTGAGE30US', 2);
  const sorted = [...data30].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const todayRate30 = parseFloat(sorted[0]?.value ?? '6.875');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <SchemaLD schema={jsonLd} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refinance Savings Calculator</h1>
        <p className="text-gray-600">
          Enter your current loan details and a new rate to see your monthly savings, break-even point, and lifetime savings.
        </p>
        <p className="text-sm text-cyan-600 mt-2">
          Today&apos;s 30-year refi rate: <strong>{todayRate30.toFixed(3)}%</strong> · Use the quick-fill buttons below to auto-fill the new rate.
        </p>
      </div>

      <RefiCalculator defaultNewRate={todayRate30} />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-cyan-100 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How the Break-Even Calculation Works</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p><strong>Break-even months</strong> = Closing Costs ÷ Monthly Savings</p>
            <p>Example: $5,000 closing costs ÷ $200 monthly savings = 25 months to break even.</p>
            <p>If you plan to stay in your home longer than the break-even point, refinancing makes financial sense.</p>
            <p>If break-even exceeds 120 months (10 years), we flag it as potentially not worth it for most homeowners.</p>
          </div>
        </div>
        <div className="bg-white border border-cyan-100 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">When Does Refinancing Make Sense?</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ Your new rate is at least 0.5% lower than your current rate</li>
            <li>✅ You plan to stay in the home past the break-even point</li>
            <li>✅ Your credit score has improved since your original loan</li>
            <li>✅ You want to switch from an ARM to a fixed rate</li>
            <li>✅ You want to access equity through cash-out refinancing</li>
            <li>✅ You can reduce your loan term without breaking the budget</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-semibold text-amber-800 mb-2">💡 Pro Tip: No-Closing-Cost Refinancing</h3>
        <p className="text-sm text-amber-700">
          Some lenders offer no-closing-cost refinancing by rolling fees into the loan or accepting a slightly higher rate.
          This eliminates upfront costs and can be ideal if you&apos;re uncertain how long you&apos;ll stay in the home.
          Use the calculator above with $0 closing costs to see if this makes sense for you.
        </p>
      </div>

      <div className="mt-6 text-center">
        <a href={`/${locale}/lenders`} className="text-cyan-600 hover:text-cyan-800 text-sm mr-6">
          Compare Lenders →
        </a>
        <a href={`/${locale}/when-to-refi`} className="text-cyan-600 hover:text-cyan-800 text-sm">
          Is It Worth Refinancing? →
        </a>
      </div>
    </div>
  );
}
