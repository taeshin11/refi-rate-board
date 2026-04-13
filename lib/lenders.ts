import fallbackData from '@/data/lenders-fallback.json';

export interface Lender {
  slug: string;
  name: string;
  refi30yr: number;
  refi15yr: number;
  cashOutRate: number;
  jumboRate: number;
  vaRefi: number;
  fhaRefi: number;
  applyUrl?: string;
  logo?: string;
  minCredit: number;
  minEquity: number;
}

export async function getLenders(): Promise<Lender[]> {
  return fallbackData as Lender[];
}

export async function getLenderBySlug(slug: string): Promise<Lender | null> {
  const lenders = await getLenders();
  return lenders.find((l) => l.slug === slug) ?? null;
}
