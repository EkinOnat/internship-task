import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

const EMPTY = { symbol: '', amount: '', purchasePrice: '' };

export default function AddAssetForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.symbol.trim()) {
      setError('Symbol is required');
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (!form.purchasePrice || Number(form.purchasePrice) <= 0) {
      setError('Enter a valid price');
      return;
    }

    setSubmitting(true);
    try {
      await onAdd({
        symbol: form.symbol.trim().toUpperCase(),
        name: form.symbol.trim().toUpperCase(),
        amount: Number(form.amount),
        purchasePrice: Number(form.purchasePrice),
      });
      setForm(EMPTY);
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while adding.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      id="add-asset-form"
      onSubmit={handleSubmit}
      className="glass-card p-4 animate-fade-in-up"
      style={{ animationDelay: '200ms' }}
    >
      <div className="flex flex-col lg:flex-row lg:items-end gap-3">
        {/* Symbol */}
        <div className="flex-1 min-w-0">
          <label className="block text-[0.65rem] uppercase tracking-widest text-slate-500 font-semibold mb-1.5">
            Symbol
          </label>
          <input
            id="input-symbol"
            type="text"
            name="symbol"
            value={form.symbol}
            onChange={handleChange}
            placeholder="BTC"
            className="input-field uppercase"
            autoComplete="off"
          />
        </div>

        {/* Amount */}
        <div className="flex-1 min-w-0">
          <label className="block text-[0.65rem] uppercase tracking-widest text-slate-500 font-semibold mb-1.5">
            Amount
          </label>
          <input
            id="input-amount"
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.5"
            step="any"
            min="0"
            className="input-field"
          />
        </div>

        {/* Purchase Price */}
        <div className="flex-1 min-w-0">
          <label className="block text-[0.65rem] uppercase tracking-widest text-slate-500 font-semibold mb-1.5">
            Purchase Price ($)
          </label>
          <input
            id="input-price"
            type="number"
            name="purchasePrice"
            value={form.purchasePrice}
            onChange={handleChange}
            placeholder="50000"
            step="any"
            min="0"
            className="input-field"
          />
        </div>

        {/* Submit */}
        <button
          id="btn-submit-asset"
          type="submit"
          disabled={submitting}
          className="btn-primary flex items-center justify-center gap-2 lg:w-auto w-full whitespace-nowrap"
        >
          {submitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus size={14} />
              Add Asset
            </>
          )}
        </button>
      </div>

      {/* Inline error */}
      {error && (
        <p className="mt-2.5 text-xs text-red-400 font-medium animate-slide-in">
          ⚠ {error}
        </p>
      )}
    </form>
  );
}
