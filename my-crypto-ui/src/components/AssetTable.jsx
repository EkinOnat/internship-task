import { useState } from 'react';
import { Trash2, Coins, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../utils/format';

export default function AssetTable({ assets, performances, onDelete, loading }) {
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Merge performance data into assets by symbol
  const perfMap = {};
  if (performances) {
    performances.forEach((p) => {
      perfMap[p.symbol?.toUpperCase()] = p;
    });
  }

  const handleDelete = async (id) => {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    setDeletingId(id);
    try {
      await onDelete(id);
    } catch (err) {
      console.error('Deletion error:', err);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '280ms' }}>
        <div className="px-6 py-5 border-b border-white/[0.04]">
          <div className="skeleton w-32 h-5 rounded" />
        </div>
        <div className="divide-y divide-white/[0.025]">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="skeleton w-10 h-10 rounded-xl" />
                <div className="space-y-2">
                  <div className="skeleton w-16 h-4 rounded" />
                  <div className="skeleton w-24 h-3 rounded" />
                </div>
              </div>
              <div className="skeleton w-20 h-5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!assets || assets.length === 0) {
    return (
      <div
        className="glass-card p-12 text-center animate-fade-in-up"
        style={{ animationDelay: '280ms' }}
      >
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
          <Coins size={28} className="text-indigo-400" />
        </div>
        <p className="text-slate-400 text-sm font-medium">
          No assets added yet
        </p>
        <p className="text-slate-600 text-xs mt-1">
          Use the form above to add your first asset
        </p>
      </div>
    );
  }

  return (
    <div
      className="glass-card overflow-hidden animate-fade-in-up"
      style={{ animationDelay: '280ms' }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Portfolio Assets</h2>
          <p className="text-[0.65rem] text-slate-600 mt-0.5">
            Your crypto assets and their performances
          </p>
        </div>
        <span className="text-[0.65rem] text-slate-600 font-semibold px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05]">
          {assets.length} assets
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table" id="asset-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Amount</th>
              <th>Purchase Price</th>
              <th>Current Price</th>
              <th>Profit / Loss</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, idx) => {
              const perf = perfMap[asset.symbol?.toUpperCase()];
              const profitLoss = perf?.profitLoss ?? null;
              const currentPrice = perf?.currentPrice ?? null;
              const isProfit = profitLoss !== null ? profitLoss >= 0 : null;

              return (
                <tr
                  key={asset.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${300 + idx * 40}ms` }}
                >
                  {/* Symbol */}
                  <td data-label="Sembol">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/15 to-purple-500/15 flex items-center justify-center text-[0.65rem] font-bold text-indigo-300 border border-indigo-500/10 flex-shrink-0">
                        {asset.symbol?.slice(0, 2)}
                      </div>
                      <span className="font-semibold text-white text-sm">
                        {asset.symbol}
                      </span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td data-label="Miktar" className="font-mono text-slate-300">
                    {asset.amount}
                  </td>

                  {/* Purchase Price */}
                  <td data-label="Alış Fiyatı" className="font-mono text-slate-400">
                    {formatCurrency(asset.purchasePrice)}
                  </td>

                  {/* Current Price */}
                  <td data-label="Güncel Fiyat" className="font-mono text-slate-300">
                    {currentPrice !== null ? formatCurrency(currentPrice) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  {/* Profit/Loss */}
                  <td data-label="Kar / Zarar">
                    {isProfit !== null ? (
                      <div className="flex items-center gap-1.5">
                        {isProfit ? (
                          <ArrowUpRight size={14} className="text-emerald-400" />
                        ) : (
                          <ArrowDownRight size={14} className="text-red-400" />
                        )}
                        <span
                          className={`font-semibold font-mono text-sm ${
                            isProfit ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {isProfit ? '+' : ''}
                          {formatCurrency(profitLoss)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  {/* Delete */}
                  <td data-label="Action" className="text-right">
                    <button
                      id={`btn-delete-${asset.id}`}
                      onClick={() => handleDelete(asset.id)}
                      disabled={deletingId === asset.id}
                      title={confirmId === asset.id ? 'Click again to delete' : 'Delete'}
                      className={`btn-icon-danger ml-auto ${
                        confirmId === asset.id ? 'confirm' : ''
                      }`}
                    >
                      {deletingId === asset.id ? (
                        <span className="animate-spin text-sm">⟳</span>
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
