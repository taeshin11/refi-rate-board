import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RateCardProps {
  label: string;
  rate: number;
  previousRate?: number;
  lastUpdated?: string;
  color?: 'cyan' | 'teal' | 'blue' | 'emerald';
}

const colorMap = {
  cyan: 'from-cyan-600 to-cyan-700',
  teal: 'from-teal-500 to-teal-600',
  blue: 'from-blue-500 to-blue-600',
  emerald: 'from-emerald-500 to-emerald-600',
};

export function RateCard({ label, rate, previousRate, lastUpdated, color = 'cyan' }: RateCardProps) {
  const change = previousRate !== undefined ? parseFloat((rate - previousRate).toFixed(3)) : 0;
  const apr = parseFloat((rate + 0.15).toFixed(3));

  return (
    <div className="bg-white rounded-xl border border-cyan-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className={`bg-gradient-to-r ${colorMap[color]} p-4 text-white`}>
        <p className="text-sm font-medium opacity-90">{label}</p>
        <p className="text-3xl font-bold mt-1">{rate.toFixed(3)}%</p>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">APR</span>
          <span className="font-medium">{apr.toFixed(3)}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Points</span>
          <span className="font-medium">0.0</span>
        </div>
        {previousRate !== undefined && (
          <div className="flex items-center justify-between text-sm pt-1 border-t border-gray-100">
            <span className="text-gray-500">vs last week</span>
            <span
              className={`flex items-center gap-1 font-semibold ${
                change > 0 ? 'text-red-500' : change < 0 ? 'text-emerald-600' : 'text-gray-500'
              }`}
            >
              {change > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : change < 0 ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              {change > 0 ? '+' : ''}{(change * 100).toFixed(0)} bps
            </span>
          </div>
        )}
        {lastUpdated && (
          <p className="text-xs text-gray-400 pt-1">Updated: {lastUpdated}</p>
        )}
      </div>
    </div>
  );
}
