
"use client";
import { useEffect, useState } from "react";

export default function AdminMaintenancePage() {
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  // 📡 получить статус
  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API}/settings/status`);
      const data = await res.json();
      setMaintenance(data.maintenance);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 переключить
  const toggleMaintenance = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`${API}/settings/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: !maintenance,
        }),
      });

      const data = await res.json();
      setMaintenance(data.maintenance);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="shadow-xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8 max-w-md w-full text-center space-y-6 text-slate-100">
        
        <h1 className="text-2xl font-bold">
          Управление сайтом
        </h1>

        {/* статус */}
        <div className="text-lg">
          Статус:
          <span
            className={`ml-2 font-semibold ${
              maintenance ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {maintenance ? "Выключен" : "Работает"}
          </span>
        </div>

        {/* кнопка */}
        <button
          onClick={toggleMaintenance}
          disabled={updating}
          className={`w-full py-3 rounded-xl text-white font-semibold transition ${
            maintenance
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {updating
            ? "Обновление..."
            : maintenance
            ? "Включить сайт"
            : "Выключить сайт"}
        </button>

        {/* описание */}
        <p className="text-sm text-slate-400">
          При выключении пользователи не смогут пользоваться сайтом
        </p>
      </div>
    </div>
  );
}