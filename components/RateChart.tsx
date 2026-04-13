'use client';

import { useEffect, useRef } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { FredObservation } from '@/lib/fred';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

interface RateChartProps {
  data30: FredObservation[];
  data15: FredObservation[];
  dataArm: FredObservation[];
  title?: string;
}

export function RateChart({ data30, data15, dataArm, title }: RateChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const labels = data30.map((d) =>
      new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '30-Year Fixed Refi',
            data: data30.map((d) => parseFloat(d.value)),
            borderColor: '#0891b2',
            backgroundColor: 'rgba(8,145,178,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 5,
            borderWidth: 2,
          },
          {
            label: '15-Year Fixed Refi',
            data: data15.map((d) => parseFloat(d.value)),
            borderColor: '#0d9488',
            backgroundColor: 'rgba(13,148,136,0.06)',
            fill: false,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 5,
            borderWidth: 2,
          },
          {
            label: '5/1 ARM Refi',
            data: dataArm.map((d) => parseFloat(d.value)),
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139,92,246,0.06)',
            fill: false,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 5,
            borderWidth: 2,
            borderDash: [4, 4],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { size: 12 }, padding: 16 },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${(ctx.parsed.y ?? 0).toFixed(2)}%`,
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => `${value}%`,
              font: { size: 11 },
            },
            grid: { color: 'rgba(0,0,0,0.04)' },
          },
          x: {
            ticks: {
              maxTicksLimit: 12,
              font: { size: 10 },
            },
            grid: { display: false },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [data30, data15, dataArm]);

  return (
    <div className="bg-white rounded-xl border border-cyan-100 shadow-sm p-6">
      {title && <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>}
      <div className="h-72">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
