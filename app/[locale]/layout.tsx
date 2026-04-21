import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import type { Metadata } from 'next';
import Script from 'next/script';
import { FeedbackButton } from '@/components/FeedbackButton';
import { AdSocialBar } from '@/components/ads/AdSocialBar';

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
  const siteUrl = 'https://refi-rate-board.vercel.app';
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Today's Refinance Rates — Should You Refi? | RefiRateBoard",
      template: '%s | RefiRateBoard',
    },
    description:
      'Compare current mortgage refinance rates from top lenders. Calculate your break-even point and monthly savings with our free refi calculator.',
    keywords: [
      'refinance rates',
      'mortgage refinance',
      'refi rates today',
      'cash-out refinance',
      'should I refinance',
      'refinance calculator',
      'refi break-even',
      'rate and term refinance',
    ],
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${siteUrl}/${l}`])
      ),
    },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/${locale}`,
      siteName: 'RefiRateBoard',
      title: "Today's Refinance Rates — Should You Refi? | RefiRateBoard",
      description:
        'Compare current mortgage refinance rates from top lenders. Calculate your break-even point and monthly savings with our free refi calculator.',
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'RefiRateBoard — Compare Today\'s Refinance Rates',
        },
      ],
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: "Today's Refinance Rates — Should You Refi? | RefiRateBoard",
      description:
        'Compare current mortgage refinance rates from top lenders. Calculate your break-even point and monthly savings with our free refi calculator.',
      images: [`${siteUrl}/og-image.png`],
    },
    other: {
      'google-adsense-account': 'ca-pub-7098271335538021',
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
      <AdSocialBar />
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7098271335538021" crossOrigin="anonymous" strategy="afterInteractive" />
      <FeedbackButton siteName="RefiRateBoard" />
      <Footer locale={locale} />
    </NextIntlClientProvider>
  );
}
