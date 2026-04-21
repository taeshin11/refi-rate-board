import { SchemaLD } from '@/components/SchemaLD';
import { Breadcrumb } from '@/components/Breadcrumb';
import { routing } from '@/i18n/routing';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'How to Use RefiRateBoard — Refinance FAQ & Guide',
  description:
    'Learn how to use RefiRateBoard to compare refinance rates, calculate your break-even point, and decide if refinancing is right for you. Answers to the most common refi questions.',
};

const faqs = [
  {
    q: 'What is a refinance?',
    a: 'A mortgage refinance replaces your existing home loan with a new one — typically to get a lower interest rate, reduce your monthly payment, change your loan term, or access home equity. You pay off your old mortgage and begin making payments on the new loan.',
  },
  {
    q: 'When should I refinance?',
    a: 'Refinancing generally makes sense when: (1) you can lower your rate by at least 0.5%–1%, (2) you plan to stay in the home long enough to recoup closing costs (the break-even point), and (3) your credit score and equity qualify you for a better rate than you currently have. Use our break-even calculator to check your specific numbers.',
  },
  {
    q: 'What is the break-even point for refinancing?',
    a: 'The break-even point is how long it takes to recoup your refinancing closing costs through monthly savings. Calculate it by dividing total closing costs by your monthly payment reduction. For example: $5,000 closing costs ÷ $200/month savings = 25 months. If you plan to stay in the home past 25 months, refinancing saves money.',
  },
  {
    q: 'What is a cash-out refinance?',
    a: 'A cash-out refinance lets you borrow more than your current loan balance and receive the difference in cash. For example, if your home is worth $400,000 and you owe $200,000, you might refinance for $280,000 and receive $80,000 cash — useful for home improvements, debt consolidation, or major expenses. Cash-out rates are typically 0.125%–0.5% higher than rate-and-term rates.',
  },
  {
    q: 'How much does it cost to refinance?',
    a: 'Refinance closing costs typically run 2%–5% of your loan amount, or $4,000–$10,000 on a $200,000 loan. Common costs include loan origination fees (0.5%–1%), home appraisal ($300–$700), title search and insurance ($1,000–$2,000), and prepaid property taxes and insurance. Some lenders offer "no-closing-cost" refinances that roll costs into a higher rate.',
  },
  {
    q: 'What is a rate-and-term refinance?',
    a: 'A rate-and-term refinance changes your interest rate, your loan term (e.g., 30 years to 15 years), or both — without taking any cash out. It\'s the most common type of refinance, used primarily to lower monthly payments or pay off the mortgage faster. Because no cash is extracted, rates are generally lower than cash-out refinances.',
  },
  {
    q: 'Will refinancing hurt my credit score?',
    a: 'Refinancing causes a small, temporary dip in your credit score — typically 5–10 points from the hard inquiry. Rate shopping with multiple lenders within a 14–45 day window counts as a single inquiry under FICO scoring models. The long-term credit impact of lower debt balances and on-time payments is positive.',
  },
  {
    q: 'How long does refinancing take?',
    a: 'Most refinances close in 30–45 days from application. Simple rate-and-term refinances with strong credit can sometimes close in 3–4 weeks. FHA streamline and VA IRRRL refinances are designed to be faster, sometimes closing in 2–3 weeks. Delays often come from appraisals, title searches, and document verification.',
  },
  {
    q: 'What documents do I need to refinance?',
    a: 'Typical refinance documents include: last 2 months of pay stubs, last 2 years of W-2s or tax returns (self-employed borrowers may need business returns too), last 2–3 months of bank statements, your current mortgage statement, a government-issued ID, and proof of homeowners insurance. Your lender will provide a full list specific to your situation.',
  },
  {
    q: 'How much equity do I need to refinance?',
    a: 'For a conventional rate-and-term refinance, most lenders require at least 5%–20% equity (80%–95% LTV). To avoid private mortgage insurance (PMI), you typically need 20% equity. For cash-out refinancing, lenders usually limit borrowing to 80% of your home\'s value, so you\'ll need at least 20% equity remaining after the cash-out. FHA and VA loans have different, often more flexible, equity requirements.',
  },
];

export default async function HowToUsePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

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
        <Breadcrumb items={[{ label: 'Home', href: '' }, { label: 'How to Use' }]} locale={locale} />

        <h1 className="text-3xl font-bold text-gray-900 mb-3">How to Use RefiRateBoard</h1>
        <p className="text-gray-500 text-sm mb-8">A practical guide to reading refi rates and deciding if refinancing makes sense for you.</p>

        {/* Quick steps */}
        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">4 Steps to Your Refi Decision</h2>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Check today\'s rates', desc: 'See the current 30-yr, 15-yr, cash-out, and rate-and-term refi rates on our homepage. Compare to the rate on your existing mortgage.' },
              { step: '2', title: 'Find the rate difference', desc: 'If today\'s rate is at least 0.5% below your current rate, refinancing could save you money. The bigger the drop, the faster you\'ll break even.' },
              { step: '3', title: 'Calculate your break-even', desc: 'Use our free Break-Even Calculator to enter your loan details and see exactly how many months until your savings exceed your closing costs.' },
              { step: '4', title: 'Compare lenders', desc: 'Browse our lender profiles to find who offers the best rates for your loan type, state, and credit profile — then apply directly.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 bg-white rounded-xl p-4 border border-cyan-100">
                <span className="shrink-0 w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tools overview */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tools Available on RefiRateBoard</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Rate Dashboard', desc: 'Live rate cards for 30-yr, 15-yr, ARM, and cash-out refi — updated each business day from FRED data.', href: `/${locale}` },
              { title: 'Break-Even Calculator', desc: 'Enter your current rate, new rate, and loan balance to see monthly savings and months to break even.', href: `/${locale}/calculator` },
              { title: 'Lender Comparison', desc: 'Side-by-side profiles of major U.S. refi lenders with rates, credit requirements, and loan types.', href: `/${locale}/lenders` },
              { title: 'Rates by State', desc: 'Explore refinance rate conditions and lender options for your specific state.', href: `/${locale}/states` },
              { title: 'Loan Types Guide', desc: 'Deep-dive explanations of 30-yr fixed, 15-yr fixed, cash-out, FHA streamline, VA IRRRL, and ARM refi loans.', href: `/${locale}/loan-types` },
              { title: 'When to Refi Guide', desc: 'Decision checklist and full guide on the break-even rule, common mistakes, and rate timing.', href: `/${locale}/when-to-refi` },
            ].map((tool) => (
              <Link key={tool.title} href={tool.href} className="card hover:border-cyan-300 transition-colors group">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-cyan-700">{tool.title}</h3>
                <p className="text-sm text-gray-600">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Refinancing FAQ</h2>
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
            Try the Break-Even Calculator
          </Link>
          <Link
            href={`/${locale}/lenders`}
            className="border border-cyan-300 text-cyan-700 px-8 py-3 rounded-xl font-semibold hover:bg-cyan-50 transition-colors"
          >
            Compare Lenders
          </Link>
        </div>
      </div>
    </>
  );
}
