"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

export default function DealersPage() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchDealers = async () => {
      try {
        setLoading(true);
        let query = [];
        if (filterStatus) query.push(`status=${filterStatus}`);
        if (search) query.push(`search=${search}`);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/dealers?${query.join("&")}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setDealers(data);
      } catch (error) {
        console.error("Ошибка загрузки дилеров:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDealers();
  }, [filterStatus, search]);

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: "bg-amber-500/15 text-amber-300",
      APPROVED: "bg-emerald-500/15 text-emerald-300",
      REJECTED: "bg-red-500/15 text-red-300",
    };
    return badges[status] || "bg-slate-800 text-slate-300";
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Дилеры</h1>
          <p className="text-slate-400 text-sm md:text-base">
            Управление дилерами и их статусами
          </p>
        </div>

        {/* Фильтры */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Статус</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-slate-700 rounded-lg p-3 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-blue-500/30 transition-all"
              >
                <option value="">Все статусы</option>
                <option value="PENDING">Ожидает</option>
                <option value="APPROVED">Одобрено</option>
                <option value="REJECTED">Отклонено</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Поиск</label>
              <input
                type="text"
                placeholder="Поиск по имени или email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-slate-700 rounded-lg p-3 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Контент */}
        {loading ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-slate-400 mt-4">Загрузка...</p>
          </div>
        ) : dealers.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-12 text-center">
            <p className="text-slate-400 text-lg">Дилеры не найдены</p>
          </div>
        ) : (
          <>
            {/* ДЕСКТОП — таблица */}
            <div className="hidden lg:block rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden">
              <div className="grid grid-cols-6 bg-slate-800 text-slate-200 text-xs uppercase font-semibold tracking-wider px-6 py-3">
                <div>ID</div>
                <div>Название</div>
                <div>Тип</div>
                <div>Email владельца</div>
                <div>Статус</div>
                <div>Premium</div>
              </div>
              <div className="divide-y divide-slate-800">
                {dealers.map((d) => (
                  <Link
                    href={`/Admin/Dealers/${d._id}`}
                    key={d._id}
                    className="grid grid-cols-6 px-6 py-4 hover:bg-slate-800/70 cursor-pointer transition-colors"
                  >
                    <div className="text-sm text-slate-500 font-mono">{d._id.slice(-6)}</div>
                    <div className="text-slate-100">{d.name}</div>
                    <div className="text-slate-300">{d.type}</div>
                    <div className="text-slate-300">{d.owner?.email}</div>
                    <div>
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusBadge(d.status)}`}>
                        {d.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      {d.isPremium ? <FaCheckCircle className="text-green-500" /> : <span className="text-slate-500">—</span>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* МОБИЛЬ — карточки */}
            <div className="lg:hidden flex flex-col gap-3">
              {dealers.map((d) => (
                <Link
                  href={`/Admin/Dealers/${d._id}`}
                  key={d._id}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 hover:border-blue-500/40 transition"
                >
                  {/* Верхняя строка */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-100">{d.name}</p>
                      <p className="text-xs text-slate-500 font-mono">ID: {d._id.slice(-6)}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadge(d.status)}`}>
                      {d.status}
                    </span>
                  </div>

                  {/* Детали */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span>🏢 {d.type}</span>
                    <span>✉️ {d.owner?.email || "—"}</span>
                    {d.isPremium && <span className="text-yellow-400">⭐ Премиум</span>}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}