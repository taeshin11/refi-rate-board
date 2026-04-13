'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export function VisitorCounter() {
  const t = useTranslations('footer');
  const [counts, setCounts] = useState({ today: 0, total: 0 });

  useEffect(() => {
    async function trackVisit() {
      try {
        const todayKey = new Date().toISOString().split('T')[0];
        const lastDate = localStorage.getItem('rrb_last_date');
        let todayCount =
          lastDate === todayKey ? parseInt(localStorage.getItem('rrb_today') ?? '0', 10) : 0;
        todayCount++;
        localStorage.setItem('rrb_last_date', todayKey);
        localStorage.setItem('rrb_today', String(todayCount));

        const res = await fetch('/api/visitor-count', { method: 'POST' });
        const data = await res.json();
        setCounts({ today: todayCount, total: data.total });
      } catch {
        setCounts({ today: 1, total: 1 });
      }
    }
    trackVisit();
  }, []);

  return (
    <div className="text-xs text-gray-400 text-center mt-4">
      <span>{t('visitorToday')}: <strong className="text-gray-500">{counts.today.toLocaleString()}</strong></span>
      {' | '}
      <span>{t('visitorTotal')}: <strong className="text-gray-500">{counts.total.toLocaleString()}</strong></span>
    </div>
  );
}
