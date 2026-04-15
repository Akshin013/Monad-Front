"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка: " + res.status);
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen">
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Пользователи</h2>
            <p className="mt-1 text-sm text-slate-400">
              Список всех зарегистрированных пользователей
            </p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3">
            <p className="text-xs text-slate-500">Всего</p>
            <p className="text-2xl font-bold text-blue-300">{users.length}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по email, телефону, роли..."
          className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">
          Загрузка...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">
          Пользователи не найдены
        </div>
      ) : (
        <>
          {/* МОБИЛЬНЫЕ КАРТОЧКИ — только на телефоне */}
          <div className="flex flex-col gap-3 md:hidden">
            {filteredUsers.map((u) => (
              <Link
                key={u._id}
                href={`/Admin/Users/${u._id}`}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 flex flex-col gap-2 hover:border-blue-500/50 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-blue-300 font-medium text-sm truncate max-w-[70%]">
                    {u.email}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    u.is_verified
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {u.is_verified ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>📞 {u.phone || "—"}</span>
                  <span className="capitalize">Role  {u.role}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* ТАБЛИЦА — только на десктопе */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70">
            <table className="min-w-full">
              <thead className="bg-slate-800 text-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Телефон</th>
                  <th className="px-4 py-3 text-left">Роль</th>
                  <th className="px-4 py-3 text-left">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <tr
                    key={u._id}
                    className={`border-t border-slate-800 transition ${
                      i % 2 === 0 ? "bg-slate-900/30" : "bg-slate-900/60"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-blue-300">
                      <Link href={`/Admin/Users/${u._id}`} className="hover:text-blue-200 hover:underline">
                        {u.email}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <Link href={`/Admin/Users/${u._id}`} className="hover:text-blue-200 hover:underline">
                        {u.phone || "-"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-300 capitalize">
                      <Link href={`/Admin/Users/${u._id}`} className="hover:text-blue-200 hover:underline">
                        {u.role}
                      </Link>
                    </td>
                    <td className={`px-4 py-3 font-semibold ${u.is_verified ? "text-emerald-400" : "text-amber-400"}`}>
                      <Link href={`/Admin/Users/${u._id}`} className="hover:underline">
                        {u.is_verified ? "Verified" : "Pending"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}