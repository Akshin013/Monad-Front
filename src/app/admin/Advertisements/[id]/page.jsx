"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../../hooks/useAuth.js";

export default function AdminAdsRequestDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { token, user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  const fetchData = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ads-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setData(json);
      setStatus(json.status);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const updateStatus = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ads-requests/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  const addNote = async () => {
    if (!note.trim()) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ads-requests/${id}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: note }),
    });
    setNote("");
    fetchData();
  };

  if (!token) return <p className="p-10 text-center text-slate-400">Нет доступа</p>;
  if (loading) return <p className="p-10 text-center text-slate-400">Загрузка...</p>;
  if (!data) return <p className="p-10 text-center text-red-300">Заявка не найдена</p>;

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{data.company}</h1>
            <p className="text-slate-500">Заявка №{data._id}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700"
            >
              ← Назад
            </button>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-100"
            >
              <option value="new">Новая</option>
              <option value="in_progress">В работе</option>
              <option value="done">Завершена</option>
            </select>

            <button
              onClick={updateStatus}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Main Info */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4 text-slate-200">
            <h2 className="text-xl font-semibold">Информация</h2>

            <Info label="Контакт" value={data.name} />
            <Info label="Email" value={data.email} />
            <Info label="Телефон" value={data.phone || "—"} />
            <Info label="Сообщение" value={data.message || "—"} multiline />
            <Info label="Дата" value={new Date(data.createdAt).toLocaleString("ru-RU")} />
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-xl font-semibold mb-4">История статусов</h2>

            <div className="space-y-4">
              {data.history?.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="font-medium">{h.status}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(h.date).toLocaleString("ru-RU")}
                    </p>
                    <p className="text-xs text-slate-500">by {h.by || "system"}</p>
                  </div>
                </div>
              )) || <p className="text-slate-500">Нет истории</p>}
            </div>
          </div>

        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold mb-4">Комментарии менеджера</h2>

          <div className="space-y-3 mb-4">
            {data.notes?.map((n, i) => (
              <div key={i} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-slate-200">
                <p>{n.text}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {n.by || "manager"} • {new Date(n.date).toLocaleString("ru-RU")}
                </p>
              </div>
            )) || <p className="text-slate-500">Нет комментариев</p>}
          </div>

          <div className="flex gap-3">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Добавить комментарий..."
              className="flex-1 border border-slate-700 bg-slate-950 text-slate-100 rounded-xl px-4 py-3"
            />
            <button
              onClick={addNote}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Добавить
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* UI COMPONENT */

function Info({ label, value, multiline }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`font-medium ${multiline ? "whitespace-pre-wrap" : ""}`}>
        {value}
      </p>
    </div>
  );
}
