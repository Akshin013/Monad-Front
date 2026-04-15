'use client'
import { useState, useEffect } from 'react';

export default function MaintenanceToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    fetch('/api/maintenance/status')
      .then(r => r.json())
      .then(d => setEnabled(d.maintenance));
  }, []);

  const toggle = async () => {
    const res = await fetch('/api/maintenance/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !enabled })
    });
    const data = await res.json();
    setEnabled(data.maintenance);
  };

  return (
    <button 
      onClick={toggle}
      className={`px-4 py-2 rounded font-bold ${
        enabled ? 'bg-green-500' : 'bg-red-500'
      } text-white`}
    >
      {enabled ? '✅ Включить сайт' : '🔴 Отключить сайт'}
    </button>
  );
}
