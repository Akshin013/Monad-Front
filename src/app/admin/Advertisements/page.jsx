"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import { useAuth } from "../../Context/AuthContext";
import { useAuth } from "../../../hooks/useAuth.js";

export default function AdminAdsRequestsPage() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchRequests = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ads-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Ошибка загрузки заявок:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const filtered = requests.filter((r) => {
    if (status && r.status !== status) return false;
    if (search && !(
      r.company.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
    )) return false;
    return true;
  });

  const changeStatus = async (id, status) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ads-requests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    fetchRequests();
  };

  const deleteRequest = async (id) => {
    if (!confirm("Удалить заявку?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ads-requests/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRequests();
  };

  const badge = (status) => ({
    new: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
  }[status]);

  if (!token) return <p className="p-10 text-center text-slate-400">Необходима авторизация</p>;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Заявки на рекламу</h1>
          <p className="text-slate-400">Управление рекламными заявками</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 mb-6 grid md:grid-cols-3 gap-4">
          <input
            placeholder="Поиск по компании / email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-700 rounded-lg p-3 bg-slate-950 text-slate-100"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-slate-700 rounded-lg p-3 bg-slate-950 text-slate-100"
          >
            <option value="">Все статусы</option>
            <option value="new">Новая</option>
            <option value="in_progress">В работе</option>
            <option value="done">Завершена</option>
          </select>
        </div>

        {/* Таблица */}
        <div className="hidden lg:block rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden">
          <table className="min-w-full divide-y">
            <thead className="bg-slate-800 text-slate-200">
              <tr>
                {["Компания", "Контакт", "Email", "Статус", "Дата", "Действия"].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r._id} className="hover:bg-slate-800/70 text-slate-200">
                  <td className="px-6 py-4 font-medium">{r.company}</td>
                  <td className="px-6 py-4">{r.name}</td>
                  <td className="px-6 py-4">{r.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(r.createdAt).toLocaleString("ru-RU")}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => setSelected(r)} className="bg-blue-500 text-white px-3 py-1 rounded-lg">👁</button>
                    <button onClick={() => deleteRequest(r._id)} className="bg-red-500 text-white px-3 py-1 rounded-lg">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="lg:hidden space-y-4">
          {filtered.map(r => (
            <div key={r._id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-bold">{r.company}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${badge(r.status)}`}>
                  {r.status}
                </span>
              </div>
              <p className="text-sm text-slate-300">{r.name}</p>
              <p className="text-sm text-slate-300">{r.email}</p>

              <div className="flex gap-2 mt-3">
                <button onClick={() => setSelected(r)} className="flex-1 bg-blue-500 text-white py-2 rounded-lg">👁</button>
                <button onClick={() => deleteRequest(r._id)} className="bg-red-500 text-white px-4 rounded-lg">🗑</button>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <RequestModal
            request={selected}
            onClose={() => setSelected(null)}
            onChangeStatus={changeStatus}
          />
        )}
      </div>
    </div>
  );
}

/* ================= MODAL ================= */

function RequestModal({ request, onClose, onChangeStatus }) {
  const [status, setStatus] = useState(request.status);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center  text-black z-50 p-4">
      <div className="bg-black rounded-2xl max-w-2xl w-full shadow-xl">
        <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-t-2xl text-black">
          <h2 className="text-xl font-bold">Заявка на рекламу</h2>
        </div>

        <div className="p-6 space-y-3 bg-white text-black">
          <p><b>Компания:</b> {request.company}</p>
          <p><b>Контакт:</b> {request.name}</p>
          <p><b>Email:</b> {request.email}</p>
          <p><b>Телефон:</b> {request.phone || "—"}</p>
          <p><b>Сообщение:</b> {request.message || "—"}</p>

          <div>
            <label className="font-semibold">Статус</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-3 rounded-lg w-full mt-1"
            >
              <option value="new">Новая</option>
              <option value="in_progress">В работе</option>
              <option value="done">Завершена</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Отмена</button>
          <button
            onClick={() => {
              onChangeStatus(request._id, status);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
