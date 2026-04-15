'use client'
import { useState, useEffect } from 'react';

export default function MaintenancePage() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [lastChanged, setLastChanged] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/maintenance/status')
      .then(r => r.json())
      .then(d => {
        setEnabled(d.maintenance);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggle = async () => {
    setToggling(true);
    try {
      const res = await fetch('http://localhost:5000/api/maintenance/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !enabled }),
      });
      const data = await res.json();
      setEnabled(data.maintenance);
      setLastChanged(new Date().toLocaleTimeString('ru-RU'));
    } catch (e) {
      alert('Ошибка соединения с сервером');
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        {/* Заголовок */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">Панель управления</p>
          <h1 className="text-3xl font-bold text-white">Режим обслуживания</h1>
        </div>

        {/* Основная карточка */}
        <div className={`
          relative rounded-2xl border p-8 transition-all duration-500
          ${enabled 
            ? 'bg-red-950/20 border-red-800/40' 
            : 'bg-slate-900 border-slate-700/50'
          }
        `}>

          {/* Статус индикатор */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${loading ? 'bg-slate-500 animate-pulse' :
                enabled ? 'bg-red-500 shadow-[0_0_12px_#ef4444]' : 
                'bg-emerald-500 shadow-[0_0_12px_#10b981]'}
            `} />
            <span className="text-sm text-slate-400">
              {loading ? 'Загрузка...' : enabled ? 'Сайт недоступен для пользователей' : 'Сайт работает в штатном режиме'}
            </span>
          </div>

          {/* Большой статус */}
          <div className="mb-8 py-6 border-y border-slate-700/50">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Текущий статус</p>
            <p className={`text-4xl font-black transition-all duration-300 ${
              loading ? 'text-slate-600' :
              enabled ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {loading ? '—' : enabled ? 'ВЫКЛЮЧЕН' : 'ВКЛЮЧЁН'}
            </p>
          </div>

          {/* Кнопка */}
          <button
            onClick={toggle}
            disabled={loading || toggling}
            className={`
              w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest
              transition-all duration-300 flex items-center justify-center gap-3
              disabled:opacity-50 disabled:cursor-not-allowed
              ${enabled
                ? 'bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white shadow-lg shadow-emerald-900/40'
                : 'bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white shadow-lg shadow-red-900/40'
              }
            `}
          >
            {toggling ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Применяется...
              </>
            ) : enabled ? (
              <>
                <span>✓</span> Включить сайт
              </>
            ) : (
              <>
                <span>⏻</span> Отключить сайт
              </>
            )}
          </button>

          {/* Последнее изменение */}
          {lastChanged && (
            <p className="text-center text-xs text-slate-600 mt-4">
              Последнее изменение: {lastChanged}
            </p>
          )}
        </div>

        {/* Предупреждение */}
        <div className="mt-4 p-4 rounded-xl bg-amber-950/20 border border-amber-800/30">
          <p className="text-xs text-amber-600/80">
            ⚠️ При отключении сайта все пользователи будут перенаправлены на страницу обслуживания. Администраторы сохраняют доступ.
          </p>
        </div>

      </div>
    </div>
  );
}