import { SchemaLD } from '@/components/SchemaLD';
import { Breadcrumb } from '@/components/Breadcrumb';
import { routing } from '@/i18n/routing';
import { fetchFredSeries } from '@/lib/fred';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Is It Worth Refinancing? When to Refi Guide (2026) | RefiRateBoard',
  description: 'Complete guide to deciding when to refinance your mortgage. Learn the break-even rule, when rates favor refinancing, and common refi mistakes to avoid.',
};

const faqs = [
  {
    q: 'How much should my rate drop to make refinancing worth it?',
    a: 'The traditional rule of thumb is a 1% rate drop, but with today\'s higher loan balances, even a 0.5% reduction can save thousands. Use our break-even calculator to find the exact threshold for your situation.',
  },
  {
    q: 'Should I refinance if I plan to move in 3 years?',
    a: 'Only if your break-even point is under 3 years. For example, if you save $200/month and closing costs are $4,000, you break even in 20 months — refinancing would be worth it for a 3-year stay.',
  },
  {
    q: 'Can I refinance with bad credit?',
    a: 'FHA streamline and VA IRRRL refinances have lower credit requirements (580+). If you already have an FHA or VA loan, you may qualify even with imperfect credit. Conventional refi typically requires 620+.',
  },
  {
    q: 'Does refinancing hurt my credit score?',
    a: 'Yes, briefly. A hard inquiry typically drops your score 5-10 points. However, rate shopping within a 45-day window counts as a single inquiry. The long-term impact of lower debt is positive.',
  },
  {
    q: 'Can I roll closing costs into my refinance?',
    a: 'Yes, in most cases. Many lenders allow you to roll closing costs into the loan balance or accept a slightly higher rate in exchange for lender credits covering the costs (no-closing-cost refinance).',
  },
];

export default async function WhenToRefiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const data30 = await fetchFredSeries('MORTGAGE30US', 4);
  const sorted = [...data30].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const currentRate = parseFloat(sorted[0]?.value ?? '6.875');
  const lastUpdated = sorted[0]?.date ?? new Date().toISOString().split('T')[0];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <>
      <SchemaLD schema={faqSchema} />
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '' }, { label: 'When to Refi?' }]} locale={locale} />

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Is It Worth Refinancing? A Complete Guide</h1>
        <p className="text-gray-500 text-sm mb-8">Updated April 2026 · Current 30-yr rate: {currentRate.toFixed(3)}% (as of {lastUpdated})</p>

        {/* Decision checklist */}
        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Decision Checklist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { check: true, text: 'My new rate would be at least 0.5% lower' },
              { check: true, text: 'I plan to stay in my home past the break-even point' },
              { check: true, text: 'My credit score is 620+ (740+ for best rates)' },
              { check: true, text: 'I have at least 20% equity (or FHA/VA loan)' },
              { check: false, text: 'I\'m planning to sell within 12 months' },
              { check: false, text: 'My break-even is longer than 10 years' },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-2 p-3 rounded-lg ${item.check ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <span className={`text-lg ${item.check ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.check ? '✓' : '✗'}
                </span>
                <p className="text-sm text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">Green = reasons to refi · Red = reasons to wait</p>
        </div>

        {/* Guide sections */}
        <div className="prose max-w-none space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900">The Break-Even Rule</h2>
            <p>The most important factor in a refinancing decision is the break-even point: how long it takes to recoup your closing costs through monthly savings.</p>
            <div className="bg-white border border-gray-200 rounded-xl p-5 my-4">
              <p className="font-mono text-gray-800">Break-even months = Closing Costs ÷ Monthly Savings</p>
              <p className="text-sm text-gray-500 mt-2">Example: $6,000 closing costs ÷ $250/month savings = 24 months</p>
            </div>
            <p>If you plan to stay in your home longer than the break-even period, refinancing saves money. If you might move sooner, it may not be worth the upfront cost.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">When Rates Favor Refinancing</h2>
            <p>The current 30-year refi rate is <strong>{currentRate.toFixed(3)}%</strong>. You should consider refinancing if:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Your current rate is <strong>{(currentRate + 0.5).toFixed(2)}%</strong> or higher (0.5% rate reduction threshold)</li>
              <li>You have an adjustable-rate mortgage and want payment certainty</li>
              <li>You want to switch from a 30-year to a 15-year loan</li>
              <li>You need cash for home improvements and have 20%+ equity</li>
              <li>You want to remove a co-borrower (e.g., after divorce)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">Types of Refinancing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              {[
                { name: 'Rate-and-Term', desc: 'Lower your rate or change your loan term without taking cash out. Most common.', rate: currentRate.toFixed(3) + '%' },
                { name: 'Cash-Out Refi', desc: 'Borrow more than you owe and take the difference as cash.', rate: (currentRate + 0.25).toFixed(3) + '%' },
                { name: 'FHA Streamline', desc: 'Fast refi for existing FHA borrowers, minimal paperwork.', rate: (currentRate - 0.25).toFixed(3) + '%' },
                { name: 'VA IRRRL', desc: 'Lowest rates for eligible veterans with existing VA loans.', rate: (currentRate - 0.5).toFixed(3) + '%' },
              ].map((item) => (
                <div key={item.name} className="bg-white border border-cyan-100 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-xl font-bold text-cyan-700 my-1">{item.rate}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">Common Refi Mistakes to Avoid</h2>
            <ul className="space-y-3 text-sm">
              {[
                { mistake: 'Ignoring closing costs', fix: 'Always calculate the full break-even, including all fees.' },
                { mistake: 'Only shopping one lender', fix: 'Get quotes from 3-5 lenders — rates can vary by 0.5%+.' },
                { mistake: 'Extending your loan term unnecessarily', fix: 'If you\'re 10 years into a 30-year loan, consider a 20-year refi to avoid restarting the clock.' },
                { mistake: 'Not locking your rate', fix: 'Once you find a good rate, lock it in immediately — rates change daily.' },
                { mistake: 'Making major credit changes during the process', fix: 'Avoid new accounts, large purchases, or job changes during your refi application.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 bg-gray-50 rounded-lg p-4">
                  <span className="text-red-500 font-bold shrink-0">✗</span>
                  <div>
                    <p className="font-medium text-gray-900">{item.mistake}</p>
                    <p className="text-gray-600 mt-0.5">{item.fix}</p>
                  </div>
                </div>
              ))}
            </ul>
          </section>
        </div>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
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

        <div className="mt-10 text-center flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/calculator`}
            className="bg-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-cyan-700 transition-colors"
          >
            Calculate My Break-Even →
          </Link>
          <Link
            href={`/${locale}/lenders`}
            className="border border-cyan-300 text-cyan-700 px-8 py-3 rounded-xl font-semibold hover:bg-cyan-50 transition-colors"
          >
            Compare Lenders →
          </Link>
        </div>
      </div>
    </>
  );
}
