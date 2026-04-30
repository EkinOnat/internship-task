import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/format';

function StatCard({ icon: Icon, label, value, badge, variant = 'default', delay = 0 }) {
  const variantClass =
    variant === 'profit'
      ? 'stat-card stat-card-profit'
      : variant === 'loss'
      ? 'stat-card stat-card-loss'
      : 'stat-card';

  const iconBg =
    variant === 'profit'
      ? 'bg-emerald-500/10 text-emerald-400'
      : variant === 'loss'
      ? 'bg-red-500/10 text-red-400'
      : 'bg-indigo-500/10 text-indigo-400';

  return (
    <div
      className={`${variantClass} animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-5">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon size={19} strokeWidth={2} />
        </div>
        {badge && (
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              badge.startsWith('+')
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="text-[0.65rem] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">
        {label}
      </p>
      <p className="text-[1.75rem] font-extrabold tracking-tight text-white leading-tight">
        {value}
      </p>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="stat-card space-y-4">
      <div className="skeleton w-11 h-11 rounded-xl" />
      <div className="skeleton w-24 h-3 rounded" />
      <div className="skeleton w-36 h-8 rounded" />
    </div>
  );
}

export default function SummaryCards({ summary, loading }) {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  const isProfit = summary.totalProfitLossUsd >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={DollarSign}
        label="Total Portfolio Value"
        value={formatCurrency(summary.totalValueUsd)}
        delay={0}
      />
      <StatCard
        icon={isProfit ? TrendingUp : TrendingDown}
        label="Total Profit / Loss"
        value={formatCurrency(Math.abs(summary.totalProfitLossUsd))}
        badge={formatPercentage(summary.profitLossPercentage)}
        variant={isProfit ? 'profit' : 'loss'}
        delay={80}
      />
      <StatCard
        icon={Percent}
        label="Profit Ratio"
        value={formatPercentage(summary.profitLossPercentage)}
        variant={isProfit ? 'profit' : 'loss'}
        delay={160}
      />
    </div>
  );
}
