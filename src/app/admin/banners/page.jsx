"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchBanners = () => {
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка: " + res.status);
        return res.json();
      })
      .then(setBanners)
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchBanners();
  }, []);

  const approveBanner = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBanners();
  };

  const rejectBanner = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/${id}/reject`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBanners();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
          <div>
            <h2 className="text-xl font-bold text-white">Баннеры</h2>
            <p className="text-sm text-slate-400">Управление рекламными баннерами</p>
          </div>
          <Link
            href="/Admin/Banners/Create"
            className="flex items-center justify-center w-12 h-12 
             bg-green-600 text-white text-2xl font-bold 
             rounded-lg shadow 
             hover:bg-green-700 hover:shadow-md 
             transition-all duration-200"
          >
            +
          </Link>
        </div>

        {loading ? (
          <p className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">Загрузка...</p>
        ) : banners.length === 0 ? (
          <p className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">Баннеры не найдены</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((b) => (
              <Link href={`/Admin/Banners/${b._id}`}
                key={b._id}
                className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden hover:border-blue-500/40 transition"
              >
                {/* Картинка с кликабельным переходом */}
                <a
                  href={b.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={b.image}
                    alt={b.title}
                    className="h-48 w-full object-cover hover:scale-105 transition-transform"
                  />
                </a>

                {/* Контент */}
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-bold text-slate-100">{b.title}</h2>
                  <p className="text-sm text-blue-300 truncate">
                    <a
                      href={b.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {b.link}
                    </a>
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                    <span className="px-2 py-1 bg-slate-800 rounded">{b.type}</span>
                    <span className="px-2 py-1 bg-slate-800 rounded">{b.device}</span>
                    <span className="px-2 py-1 bg-slate-800 rounded">
                      {b.size.width}×{b.size.height}px
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        b.approved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {b.approved ? "Approved" : "Pending"}
                    </span>
                    <span className="text-sm font-medium text-slate-300">
                      Клики: {b.clicks} | Просмотры: {b.views}
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                    {!b.approved && (
                      <button
                        onClick={() => approveBanner(b._id)}
                        className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => rejectBanner(b._id)}
                      className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
