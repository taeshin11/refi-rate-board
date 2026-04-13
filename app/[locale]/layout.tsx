import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import type { Metadata } from 'next';

type Locale = 'en' | 'ko' | 'ja' | 'zh' | 'es' | 'fr' | 'de' | 'pt';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL('https://refi-rate-board.vercel.app'),
    title: {
      default: "Today's Refinance Rates — Compare 30yr, 15yr & Cash-Out | RefiRateBoard",
      template: '%s | RefiRateBoard',
    },
    description: "Compare today's refinance rates from top lenders. Current 30-year, 15-year, cash-out, VA IRRRL, and FHA streamline refi rates updated daily.",
    alternates: {
      canonical: `https://refi-rate-board.vercel.app/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}`])
      ),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Navbar locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
    </NextIntlClientProvider>
  );
}
