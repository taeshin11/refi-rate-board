'use client';

import { useState, useCallback } from 'react';
import { calcMonthlyPayment, fmtCurrency, formatBreakEven } from '@/lib/utils';

interface RefiCalculatorProps {
  defaultNewRate?: number;
}

export function RefiCalculator({ defaultNewRate = 6.875 }: RefiCalculatorProps) {
  const [form, setForm] = useState({
    currentBalance: 300000,
    currentRate: 7.5,
    remainingMonths: 300,
    newRate: defaultNewRate,
    newTermMonths: 360,
    closingCosts: 5000,
  });

  const [result, setResult] = useState<{
    currentPayment: number;
    newPayment: number;
    monthlySavings: number;
    breakEvenMonths: number;
    lifetimeSavings: number;
  } | null>(null);

  const calculate = useCallback(() => {
    const { currentBalance, currentRate, remainingMonths, newRate, newTermMonths, closingCosts } = form;
    if (currentBalance <= 0) return;

    const currentPayment = calcMonthlyPayment(currentBalance, currentRate, remainingMonths);
    const newPayment = calcMonthlyPayment(currentBalance, newRate, newTermMonths);
    const monthlySavings = currentPayment - newPayment;
    const breakEvenMonths = monthlySavings > 0 ? closingCosts / monthlySavings : Infinity;
    const lifetimeSavings = (monthlySavings * newTermMonths) - closingCosts;

    setResult({ currentPayment, newPayment, monthlySavings, breakEvenMonths, lifetimeSavings });
  }, [form]);

  const setNewRate = (rate: number) => setForm(f => ({ ...f, newRate: rate }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-cyan-100 p-6">
      {/* Quick rate fill buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-sm text-gray-500 self-center">Quick fill:</span>
        {[
          { label: "Today's 30yr (6.875%)", rate: 6.875 },
          { label: "Today's 15yr (6.125%)", rate: 6.125 },
          { label: "ARM (6.25%)", rate: 6.25 },
        ].map((btn) => (
          <button
            key={btn.rate}
            onClick={() => setNewRate(btn.rate)}
            className="text-xs px-3 py-1.5 rounded-full border border-cyan-200 text-cyan-700 hover:bg-cyan-50 transition-colors"
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Loan Balance</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={form.currentBalance}
                onChange={e => setForm(f => ({ ...f, currentBalance: +e.target.value }))}
                className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={form.currentRate}
              onChange={e => setForm(f => ({ ...f, currentRate: +e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remaining Term (months)</label>
            <input
              type="number"
              value={form.remainingMonths}
              onChange={e => setForm(f => ({ ...f, remainingMonths: +e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={form.newRate}
              onChange={e => setForm(f => ({ ...f, newRate: +e.target.value }))}
              className="w-full px-4 py-2.5 border border-cyan-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-cyan-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Term (months)</label>
            <select
              value={form.newTermMonths}
              onChange={e => setForm(f => ({ ...f, newTermMonths: +e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value={360}>30 Years (360 months)</option>
              <option value={300}>25 Years (300 months)</option>
              <option value={240}>20 Years (240 months)</option>
              <option value={180}>15 Years (180 months)</option>
              <option value={120}>10 Years (120 months)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Closing Costs</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={form.closingCosts}
                onChange={e => setForm(f => ({ ...f, closingCosts: +e.target.value }))}
                className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          <button
            onClick={calculate}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Calculate Savings
          </button>
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Current Payment</p>
                  <p className="text-xl font-bold text-gray-700">{fmtCurrency(result.currentPayment)}/mo</p>
                </div>
                <div className="bg-cyan-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-cyan-600 mb-1">New Payment</p>
                  <p className="text-xl font-bold text-cyan-700">{fmtCurrency(result.newPayment)}/mo</p>
                </div>
              </div>

              {result.monthlySavings > 0 ? (
                <>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                    <p className="text-sm text-emerald-600 font-medium mb-1">Monthly Savings</p>
                    <p className="text-4xl font-bold text-emerald-700">{fmtCurrency(result.monthlySavings)}</p>
                    <p className="text-xs text-emerald-500 mt-1">per month</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-blue-600 mb-1">Break-Even Point</p>
                      <p className="text-lg font-bold text-blue-700">{formatBreakEven(result.breakEvenMonths)}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-purple-600 mb-1">Lifetime Savings</p>
                      <p className="text-lg font-bold text-purple-700">
                        {result.lifetimeSavings > 0 ? fmtCurrency(result.lifetimeSavings) : 'Negative'}
                      </p>
                    </div>
                  </div>

                  {result.breakEvenMonths > 120 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-sm text-amber-700 font-medium">⚠️ Break-even takes over 10 years — refi may not be worth it unless you plan to stay long-term.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                  <p className="text-lg font-bold text-red-600">New rate is higher than current rate</p>
                  <p className="text-sm text-red-500 mt-1">Refinancing would increase your monthly payment.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-center">
              <div>
                <p className="text-5xl mb-3">🏠</p>
                <p className="font-medium text-gray-600">Enter your loan details and click Calculate</p>
                <p className="text-sm mt-1">See your monthly savings and break-even point instantly</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
