import { Breadcrumb } from '@/components/Breadcrumb';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Privacy Policy | RefiRateBoard',
  description: 'RefiRateBoard privacy policy. Learn how we collect, use, and protect your information when you use our free mortgage refinance rate comparison tools.',
};

const EFFECTIVE_DATE = 'April 13, 2026';
const SITE_URL = 'https://refi-rate-board.vercel.app';
const CONTACT_EMAIL = 'privacy@refirateboard.com';

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        {
          subtitle: 'Information You Provide',
          text: 'RefiRateBoard does not require account registration. If you use our Break-Even Calculator or other interactive tools, the data you enter (such as loan amounts and interest rates) is processed locally in your browser and is not transmitted to or stored on our servers.',
        },
        {
          subtitle: 'Automatically Collected Information',
          text: 'When you visit RefiRateBoard, we automatically collect certain information, including: your IP address (anonymized), browser type and version, operating system, referring URLs, pages visited and time spent, and general geographic location (country/region level). This information is collected through analytics tools to help us understand how visitors use the site.',
        },
        {
          subtitle: 'Cookies and Tracking Technologies',
          text: 'We use cookies and similar tracking technologies for analytics and advertising purposes. Analytics cookies help us understand site usage patterns. Advertising cookies are used to serve relevant ads through Google AdSense (ca-pub-7098271335538021). You can control cookie settings through your browser preferences.',
        },
      ],
    },
    {
      title: '2. How We Use Your Information',
      content: [
        {
          subtitle: 'Site Analytics',
          text: 'We use aggregated, anonymized data to understand which pages and tools are most useful, improve site performance, and prioritize new features. We use Google Analytics for this purpose.',
        },
        {
          subtitle: 'Advertising',
          text: 'RefiRateBoard is supported by display advertising served through Google AdSense. Google may use cookies to serve ads based on your interests and prior visits to our site or other sites. You can opt out of personalized advertising by visiting Google\'s Ad Settings at https://adssettings.google.com.',
        },
        {
          subtitle: 'Site Improvement',
          text: 'We analyze usage patterns to improve content, tools, and user experience. We do not sell, rent, or share your personal information with third parties for their marketing purposes.',
        },
      ],
    },
    {
      title: '3. Third-Party Services',
      content: [
        {
          subtitle: 'Google AdSense',
          text: 'We use Google AdSense to display advertisements. Google AdSense uses cookies to serve ads. Google\'s use of advertising cookies enables it and its partners to serve ads based on your visit to our site and other sites. Google\'s privacy policy is available at https://policies.google.com/privacy.',
        },
        {
          subtitle: 'Google Analytics',
          text: 'We use Google Analytics to collect and analyze site usage data. Google Analytics uses cookies and collects anonymized data about how visitors interact with our website. You can opt out of Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on.',
        },
        {
          subtitle: 'Federal Reserve Economic Data (FRED)',
          text: 'Rate data is sourced from the FRED API, operated by the Federal Reserve Bank of St. Louis. No personal data is transmitted to FRED in connection with your use of RefiRateBoard.',
        },
        {
          subtitle: 'Vercel',
          text: 'Our website is hosted on Vercel. Vercel may collect server logs including IP addresses for security and infrastructure management purposes. Vercel\'s privacy policy is available at https://vercel.com/legal/privacy-policy.',
        },
      ],
    },
    {
      title: '4. Data Retention',
      content: [
        {
          subtitle: '',
          text: 'We do not store personal data on our servers. Analytics data is retained in Google Analytics for 26 months by default, after which it is automatically deleted. Server logs maintained by Vercel are subject to Vercel\'s data retention policies.',
        },
      ],
    },
    {
      title: '5. Your Rights and Choices',
      content: [
        {
          subtitle: 'Opt Out of Analytics',
          text: 'You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on available at https://tools.google.com/dlpage/gaoptout.',
        },
        {
          subtitle: 'Opt Out of Personalized Ads',
          text: 'Visit https://adssettings.google.com to manage your Google ad personalization settings, or visit https://optout.aboutads.info to opt out of interest-based advertising from participating companies.',
        },
        {
          subtitle: 'Browser Cookie Controls',
          text: 'Most web browsers allow you to control cookies through browser settings. Disabling cookies may affect the functionality of some site features.',
        },
        {
          subtitle: 'California Residents (CCPA)',
          text: 'If you are a California resident, you have the right to know what personal information we collect, the right to delete personal information, and the right to opt out of the sale of personal information. We do not sell personal information. To exercise your rights, contact us at the email address below.',
        },
        {
          subtitle: 'European Residents (GDPR)',
          text: 'If you are located in the European Economic Area, you have rights under GDPR including the right of access, rectification, erasure, and data portability. To exercise these rights, contact us at the email address below.',
        },
      ],
    },
    {
      title: '6. Children\'s Privacy',
      content: [
        {
          subtitle: '',
          text: 'RefiRateBoard is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected information from a child, please contact us and we will promptly delete it.',
        },
      ],
    },
    {
      title: '7. Security',
      content: [
        {
          subtitle: '',
          text: 'We implement reasonable technical and organizational measures to protect information from unauthorized access, disclosure, alteration, or destruction. Our site uses HTTPS encryption for all data transmission. However, no method of internet transmission is 100% secure.',
        },
      ],
    },
    {
      title: '8. Changes to This Policy',
      content: [
        {
          subtitle: '',
          text: 'We may update this Privacy Policy from time to time. The effective date at the top of this page indicates when this policy was last revised. We encourage you to review this policy periodically. Continued use of RefiRateBoard after any changes constitutes acceptance of the updated policy.',
        },
      ],
    },
    {
      title: '9. Contact Us',
      content: [
        {
          subtitle: '',
          text: `If you have questions about this Privacy Policy or our data practices, please contact us at ${CONTACT_EMAIL}. Our website is located at ${SITE_URL}.`,
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Home', href: '' }, { label: 'Privacy Policy' }]} locale={locale} />

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-8">Effective date: {EFFECTIVE_DATE}</p>

      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-5 mb-8 text-sm text-gray-700 leading-relaxed">
        <p>
          RefiRateBoard (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website at{' '}
          <span className="font-mono text-cyan-700">{SITE_URL}</span>. This Privacy Policy explains how we collect, use,
          and protect information when you use our mortgage refinance rate comparison tools and content.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
            <div className="space-y-4">
              {section.content.map((item, i) => (
                <div key={i}>
                  {item.subtitle && (
                    <h3 className="font-semibold text-gray-800 mb-1">{item.subtitle}</h3>
                  )}
                  <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
