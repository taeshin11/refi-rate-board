import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const localeMap: Record<string, string> = {
  ko: 'ko', ja: 'ja', zh: 'zh', es: 'es', fr: 'fr', de: 'de', pt: 'pt',
};

export default async function RootPage() {
  const h = await headers();
  const al = h.get('accept-language') || '';
  for (const part of al.split(',')) {
    const primary = part.split(';')[0].trim().split('-')[0].toLowerCase();
    if (localeMap[primary]) redirect(`/${localeMap[primary]}`);
  }
  redirect('/en');
}
