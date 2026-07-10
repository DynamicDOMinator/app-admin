'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StatCard({ title, titleEn, value, unit, change, icon: Icon, gradient }) {
  const isPositive = change >= 0;

  return (
    <div className="card p-5 relative overflow-hidden">
      {/* Background gradient accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full -translate-y-8 translate-x-8`} />

      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon size={18} className="text-white" />
        </div>
        <span
          className={cn(
            'badge text-xs font-semibold',
            isPositive ? 'badge-success' : 'badge-danger'
          )}
        >
          {isPositive ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
          {Math.abs(change)}%
        </span>
      </div>

      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
          {unit && <span className="text-sm font-normal text-gray-400 mr-1">{unit}</span>}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">{title}</p>
      </div>
    </div>
  );
}
