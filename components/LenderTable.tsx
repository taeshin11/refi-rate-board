'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import type { Lender } from '@/lib/lenders';

interface LenderTableProps {
  lenders: Lender[];
  locale: string;
}

type SortKey = 'refi30yr' | 'refi15yr' | 'cashOutRate' | 'vaRefi' | 'name';

export function LenderTable({ lenders, locale }: LenderTableProps) {
  const t = useTranslations('lenders');
  const [sortKey, setSortKey] = useState<SortKey>('refi30yr');
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = [...lenders].sort((a, b) => {
    if (sortKey === 'name') {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    const aVal = (a as unknown as Record<string, number>)[sortKey] as number;
    const bVal = (b as unknown as Record<string, number>)[sortKey] as number;
    return sortAsc ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const SortHeader = ({ label, sortK }: { label: string; sortK: SortKey }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-cyan-600 select-none"
      onClick={() => handleSort(sortK)}
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="w-3 h-3" />
      </span>
    </th>
  );

  const rateColor = (rate: number) => {
    if (rate < 6.9) return 'text-emerald-700 font-bold';
    if (rate < 7.05) return 'text-amber-700 font-semibold';
    return 'text-red-600 font-semibold';
  };

  return (
    <div className="bg-white rounded-xl border border-cyan-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-cyan-50">
        <h2 className="text-lg font-semibold text-gray-900">{t('title')}</h2>
        <p className="text-sm text-gray-500 mt-1">{t('subtitle')}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cyan-50 border-b border-cyan-100">
            <tr>
              <SortHeader label={t('lender')} sortK="name" />
              <SortHeader label="30yr Refi" sortK="refi30yr" />
              <SortHeader label="15yr Refi" sortK="refi15yr" />
              <SortHeader label="Cash-Out" sortK="cashOutRate" />
              <SortHeader label="VA IRRRL" sortK="vaRefi" />
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('apply')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-50">
            {sorted.map((lender, i) => (
              <tr key={lender.slug} className={i % 2 === 0 ? 'bg-white' : 'bg-cyan-50/30'}>
                <td className="px-4 py-4">
                  <Link
                    href={`/${locale}/lenders/${lender.slug}`}
                    className="font-medium text-cyan-700 hover:text-cyan-900 flex items-center gap-1"
                  >
                    {lender.logo && <span>{lender.logo}</span>}
                    {lender.name}
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <span className={rateColor(lender.refi30yr)}>{lender.refi30yr.toFixed(3)}%</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-gray-700">{lender.refi15yr.toFixed(3)}%</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-gray-700">{lender.cashOutRate.toFixed(3)}%</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-gray-700">{lender.vaRefi.toFixed(3)}%</span>
                </td>
                <td className="px-4 py-4">
                  {lender.applyUrl ? (
                    <a
                      href={lender.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs bg-cyan-600 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-700 transition-colors"
                    >
                      {t('apply')}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      href={`/${locale}/lenders/${lender.slug}`}
                      className="text-xs text-cyan-600 hover:text-cyan-800"
                    >
                      {t('viewAll')}
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
