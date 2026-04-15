"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../../hooks/useAuth.js";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUser)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchUser();
  }, [token]);

  const toggleBlock = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}/${
        user.is_blocked ? "unblock" : "block"
      }`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchUser();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-red-400">
        Пользователь не найден
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
          {/* Кнопка назад */}
          <button onClick={() => router.back()} className="flex lg:hidden max-w-18 items-center justify-center gap-2 text-slate-400 hover:text-white transition text-sm mb-2">
            ← 
          </button>

        {/* HEADER CARD */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 shadow-lg">
          <div className="flex items-center gap-5">

            <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">
              👤
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.email}</h1>
              <p className="text-xs text-slate-500 mt-1">{user.role}</p>

              <div className="flex gap-2 mt-3 flex-wrap">

                <span className={`px-3 py-1 text-xs rounded-full border ${
                  user.is_verified
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                }`}>
                  {user.is_verified ? "VERIFIED" : "PENDING"}
                </span>

                <span className={`px-3 py-1 text-xs rounded-full border ${
                  user.is_blocked
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}>
                  {user.is_blocked ? "BLOCKED" : "ACTIVE"}
                </span>

              </div>
            </div>
          </div>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <Card label="Телефон" value={user.phone || "-"} />
          <Card label="Email" value={user.email} />
          <Card label="Роль" value={user.role} />
          <Card label="Документ" value={user.document_number || "-"} />
          <Card label="Создан" value={new Date(user.createdAt).toLocaleString()} />
          <Card label="Последний вход" value={user.last_login ? new Date(user.last_login).toLocaleString() : "-"} />

        </div>

        {/* ACTIVITY */}
        <div className="grid grid-cols-3 gap-4">

          <Stat label="Заявки" value={user.applications?.length || 0} />
          <Stat label="Баннеры" value={user.banners?.length || 0} />
          <Stat label="Рейтинг" value={user.rating || 0} />

        </div>

        {/* ACTIONS (ТОТ ЖЕ СТИЛЬ КАК У DEALER) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 shadow-lg">

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
            Управление пользователем
          </p>

          <div className="grid grid-cols-1  gap-3">

            <button
              onClick={toggleBlock}
              className={`px-4 py-3 rounded-xl text-sm font-semibold text-white transition
              bg-gradient-to-r ${
                user.is_blocked
                  ? "from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500"
                  : "from-red-500 to-red-600 hover:from-red-400 hover:to-red-500"
              }`}
            >
              {user.is_blocked ? "🔓 Разблокировать" : "🔒 Заблокировать"}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= UI ================= */

const Card = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="text-sm font-medium mt-1">{value}</p>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5 text-center">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="text-xl font-bold mt-1">{value}</p>
  </div>
);