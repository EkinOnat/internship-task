import { useState, useEffect, useCallback } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import axios from 'axios';
import SummaryCards from './components/SummaryCards';
import AddAssetForm from './components/AddAssetForm';
import AssetTable from './components/AssetTable';

/* ─── API helpers ─── */
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/* ─── Toast component (inline) ─── */
function Toast({ message, type = 'info', onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    error: 'border-red-500/30 bg-red-500/10 text-red-300',
    info: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-xl shadow-2xl toast-enter transition-opacity duration-300 ${
        colors[type]
      } ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-1 text-white/40 hover:text-white/80 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

/* ═══════════════════════════════════
   App — Single Page Dashboard
   ═══════════════════════════════════ */
export default function App() {
  // ─── State ───
  const [assets, setAssets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // ─── Fetch data ───
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [assetsRes, summaryRes] = await Promise.all([
        api.get('/Assets'),
        api.get('/Analytics/summary'),
      ]);
      setAssets(assetsRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error('Data fetch error:', err);
      setError(
        err.response?.data?.message ||
          'Error loading data. Is the backend running?'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Handlers ───
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const handleAdd = async (data) => {
    await api.post('/Assets', {
      symbol: data.symbol,
      name: data.name,
      amount: data.amount,
      purchasePrice: data.purchasePrice,
    });
    showToast(`${data.symbol} successfully added!`, 'success');
    await fetchData();
  };

  const handleDelete = async (id) => {
    await api.delete(`/Assets/${id}`);
    showToast('Asset deleted.', 'info');
    await fetchData();
  };

  // ─── Render ───
  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* ─── Header ─── */}
      <header className="flex items-center justify-between px-6 py-5 lg:px-10">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Activity size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight gradient-text">
              CryptoTracker
            </h1>
            <p className="text-[0.6rem] text-slate-600 tracking-widest uppercase font-medium">
              Portfolio Dashboard
            </p>
          </div>
        </div>

        <button
          id="btn-refresh"
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300 text-xs font-semibold disabled:opacity-30 tracking-wide"
        >
          <RefreshCw
            size={13}
            className={loading ? 'animate-spin' : ''}
          />
          Refresh
        </button>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 px-4 py-6 lg:px-10 max-w-7xl mx-auto w-full">
        {error ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5">
              <span className="text-2xl">⚠</span>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Connection Error
            </h2>
            <p className="text-sm text-slate-400 text-center max-w-md mb-6">
              {error}
            </p>
            <button onClick={fetchData} className="btn-primary flex items-center gap-2">
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <section id="dashboard-stats">
              <SummaryCards summary={summary} loading={loading} />
            </section>

            {/* Add Asset Form */}
            <section id="add-asset-section">
              <AddAssetForm onAdd={handleAdd} />
            </section>

            {/* Asset Table */}
            <section id="asset-table-section">
              <AssetTable
                assets={assets}
                performances={summary?.assetPerformances}
                onDelete={handleDelete}
                loading={loading}
              />
            </section>
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="px-6 py-5 text-center">
        <p className="text-[0.65rem] text-slate-700 tracking-wider">
          CryptoTracker &copy; {new Date().getFullYear()} — Rasyonel Internship
        </p>
      </footer>

      {/* ─── Toast ─── */}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
