import { Breadcrumb } from '@/components/Breadcrumb';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Terms of Use | RefiRateBoard',
  description:
    'RefiRateBoard terms of use. Rates are for comparison only. We are not a lender. Refinancing involves costs and risks — consult a licensed professional before making financial decisions.',
};

const EFFECTIVE_DATE = 'April 13, 2026';
const SITE_URL = 'https://refi-rate-board.vercel.app';
const CONTACT_EMAIL = 'legal@refirateboard.com';

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Home', href: '' }, { label: 'Terms of Use' }]} locale={locale} />

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Use</h1>
      <p className="text-gray-500 text-sm mb-8">Effective date: {EFFECTIVE_DATE}</p>

      {/* Critical disclaimer box */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 mb-8">
        <h2 className="font-bold text-amber-900 mb-2">Important: Not a Lender or Financial Advisor</h2>
        <p className="text-sm text-amber-800 leading-relaxed">
          RefiRateBoard is an independent information website. We are <strong>not a mortgage lender, mortgage broker,
          bank, credit union, or financial advisor.</strong> Rates displayed on this site are for informational and
          comparison purposes only — they are <strong>not offers to lend</strong> and do not constitute a mortgage
          commitment. Always consult a licensed mortgage professional and/or a{' '}
          <strong>HUD-approved housing counselor</strong> before making any refinancing decision.
        </p>
      </div>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p className="text-sm leading-relaxed">
            By accessing or using RefiRateBoard at <span className="font-mono text-cyan-700">{SITE_URL}</span>, you
            agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use this website.
            We reserve the right to update these terms at any time; continued use constitutes acceptance of any changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. We Are Not a Lender</h2>
          <p className="text-sm leading-relaxed mb-3">
            RefiRateBoard does not originate, underwrite, approve, or fund mortgage loans. We do not:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Make lending decisions or creditworthiness determinations</li>
            <li>Guarantee any interest rate or loan terms</li>
            <li>Act as a mortgage broker or receive compensation from lenders for referrals made through this site</li>
            <li>Provide legally binding rate quotes or loan commitments</li>
          </ul>
          <p className="text-sm leading-relaxed mt-3">
            To obtain an actual mortgage rate quote or loan offer, you must contact a licensed lender directly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Rates Are for Comparison Only</h2>
          <p className="text-sm leading-relaxed mb-3">
            Interest rates displayed on RefiRateBoard are sourced from the Federal Reserve Economic Data (FRED) and
            publicly available lender information. These rates:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Are national averages and may not reflect the rate available to you personally</li>
            <li>May differ from the rate you are offered based on your credit score, loan-to-value ratio, loan amount, property type, and other factors</li>
            <li>Are updated periodically and may not reflect real-time market conditions</li>
            <li>Do not include all fees and costs associated with a mortgage loan (APR may differ)</li>
            <li>Are not guaranteed by RefiRateBoard or any lender profiled on this site</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Refinancing Involves Costs and Risks</h2>
          <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
            {[
              {
                title: 'Closing Costs',
                text: 'Refinancing typically involves closing costs of 2%–5% of the loan amount. These costs must be paid upfront or rolled into the loan, increasing the total amount you owe.',
              },
              {
                title: 'Extended Loan Term',
                text: 'Refinancing into a new 30-year loan restarts your amortization schedule. Even at a lower rate, you may pay more total interest over the life of the loan if the term is extended significantly.',
              },
              {
                title: 'Prepayment Penalties',
                text: 'Some existing mortgages include prepayment penalties for paying off the loan early. Review your current mortgage documents before refinancing.',
              },
              {
                title: 'Variable Rate Risk',
                text: 'Adjustable-rate refinance loans may offer lower initial rates but carry the risk of payment increases if interest rates rise.',
              },
              {
                title: 'Home Value Risk',
                text: 'If your home value declines, you may have less equity than expected, which could affect your ability to refinance or require private mortgage insurance (PMI).',
              },
              {
                title: 'Credit Impact',
                text: 'Applying for a refinance results in a hard credit inquiry, which may temporarily lower your credit score.',
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mt-0.5">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Consult a HUD-Approved Housing Counselor</h2>
          <p className="text-sm leading-relaxed mb-3">
            Before making a refinancing decision, we strongly recommend consulting a HUD-approved housing counselor.
            These counselors provide free or low-cost advice on mortgage refinancing, loan modification, and foreclosure
            prevention through programs funded by the U.S. Department of Housing and Urban Development (HUD).
          </p>
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-cyan-900 mb-1">Find a HUD-Approved Counselor</p>
            <p className="text-cyan-800">
              Visit{' '}
              <span className="font-mono">https://www.hud.gov/counseling</span>{' '}
              or call the HUD Housing Counseling Line at <strong>1-800-569-4287</strong> (toll-free).
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Informational Purpose Only</h2>
          <p className="text-sm leading-relaxed">
            All content on RefiRateBoard — including articles, guides, FAQs, calculator outputs, and lender profiles —
            is provided for general informational purposes only and does not constitute financial, legal, tax, or
            investment advice. The information is not tailored to your individual circumstances. Reliance on any
            information provided on this site is solely at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Lender Profiles and Third-Party Links</h2>
          <p className="text-sm leading-relaxed">
            Lender profiles on RefiRateBoard are provided for comparison purposes. We do not endorse any particular
            lender. Third-party websites linked from RefiRateBoard are governed by their own terms and privacy policies.
            We are not responsible for the content, accuracy, or practices of any third-party website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Calculator Tools</h2>
          <p className="text-sm leading-relaxed">
            The Break-Even Calculator and any other calculators on RefiRateBoard produce estimates only. Calculations
            are based on inputs you provide and simplified financial models. Results do not account for all variables
            that affect actual mortgage costs, including taxes, insurance, PMI, or lender-specific fees. Calculator
            outputs are not financial advice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. Disclaimer of Warranties</h2>
          <p className="text-sm leading-relaxed">
            RefiRateBoard is provided &quot;as is&quot; without warranties of any kind, express or implied, including but not
            limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not
            warrant that the site will be uninterrupted, error-free, or free of viruses or other harmful components. We
            do not warrant the accuracy, completeness, or timeliness of any information on the site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">10. Limitation of Liability</h2>
          <p className="text-sm leading-relaxed">
            To the maximum extent permitted by applicable law, RefiRateBoard and its operators shall not be liable for
            any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of or
            reliance on this website, including but not limited to financial losses resulting from refinancing decisions
            made based on information found on this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">11. Governing Law</h2>
          <p className="text-sm leading-relaxed">
            These Terms of Use shall be governed by and construed in accordance with the laws of the United States.
            Any disputes arising from use of this website shall be subject to the exclusive jurisdiction of the
            appropriate courts.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">12. Contact</h2>
          <p className="text-sm leading-relaxed">
            Questions about these Terms of Use may be directed to <span className="font-mono text-cyan-700">{CONTACT_EMAIL}</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
