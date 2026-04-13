import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { VisitorCounter } from './VisitorCounter';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');

  return (
    <footer className="bg-white border-t border-cyan-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">RefiRateBoard</h3>
            <p className="text-sm text-gray-500">
              Compare today&apos;s refinance rates from top U.S. lenders. Free tools for homeowners exploring refi options.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Quick Links</h4>
            <ul className="space-y-1">
              {[
                { href: `/${locale}/lenders`, label: 'Refi Lenders' },
                { href: `/${locale}/states`, label: 'Rates by State' },
                { href: `/${locale}/loan-types`, label: 'Refi Types' },
                { href: `/${locale}/calculator`, label: 'Break-Even Calculator' },
                { href: `/${locale}/when-to-refi`, label: 'When to Refi?' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-cyan-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Languages</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { code: 'en', label: 'English' },
                { code: 'es', label: 'Español' },
                { code: 'fr', label: 'Français' },
                { code: 'de', label: 'Deutsch' },
                { code: 'pt', label: 'Português' },
                { code: 'ko', label: '한국어' },
                { code: 'ja', label: '日本語' },
                { code: 'zh', label: '中文' },
              ].map((lang) => (
                <Link
                  key={lang.code}
                  href={`/${lang.code}`}
                  className="text-xs text-gray-500 hover:text-cyan-600 border border-gray-200 rounded px-2 py-1"
                >
                  {lang.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 space-y-3">
          <p className="text-xs text-gray-400 text-center">{t('disclaimer')}</p>
          <VisitorCounter />
          <p className="text-xs text-gray-400 text-center">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
