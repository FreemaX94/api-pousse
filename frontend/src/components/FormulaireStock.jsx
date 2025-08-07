// File: src/components/FormulaireStock.jsx
import { useState } from 'react';

export default function FormulaireStock({ data, onNext }) {
  const safeData = Array.isArray(data) ? data : [];

  const [form, setForm] = useState(
    safeData.reduce((acc, cur) => ({ ...acc, [cur.Champ]: '' }), {})
  );

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      {safeData.map((item, i) => (
        <label key={i} className="block">
          {item.Champ}:
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={form[item.Champ] || ''}
            onChange={e => handleChange(item.Champ, e.target.value)}
          />
        </label>
      ))}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={onNext}
      >
        Terminer
      </button>
    </div>
  );
}
