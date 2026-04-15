"use client";
import { useEffect, useState } from "react";

export default function DealerRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchRequests = async () => {
      try {
        setLoading(true);

        let query = filterStatus ? `?status=${filterStatus}` : "";
        console.log("Query:", query);
        
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dealer-requests${query}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error("Ошибка загрузки заявок:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [filterStatus]);

  const approveRequest = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dealer-requests/${id}/approve`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: "APPROVED" } : r
        )
      );
    } catch (err) {
      console.error("Ошибка approve:", err);
    }
  };

  const rejectRequest = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dealer-requests/${id}/reject`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: "REJECTED" } : r
        )
      );
    } catch (err) {
      console.error("Ошибка reject:", err);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: "bg-yellow-100 text-yellow-700",
      APPROVED: "bg-green-100 text-green-700",
      REJECTED: "bg-red-100 text-red-700",
    };
    return badges[status] || "bg-gray-100 text-gray-700";
  };
console.log(requests);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Заявки дилеров
          </h1>
          <p className="text-slate-400">
            Управление заявками на создание дилерского аккаунта
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-700 bg-slate-950 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">Все статусы</option>
            <option value="PENDING">Ожидает</option>
            <option value="APPROVED">Одобрено</option>
            <option value="REJECTED">Отклонено</option>
          </select>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-slate-400 mt-4">Загрузка...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-12 text-center">
            <p className="text-slate-400 text-lg">Заявки не найдены</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden">
              <div className="grid grid-cols-5 bg-slate-800 text-slate-200 text-xs uppercase font-semibold px-6 py-3">
                <div>ID</div>
                <div>Email</div>
                <div>Тип</div>
                <div>Статус</div>
                <div>Действия</div>
              </div>

              <div className="divide-y divide-slate-800">
                {requests.map((r) => (
                  <div
                    key={r._id}
                    className="grid grid-cols-5 px-6 py-4 items-center hover:bg-slate-800/60"
                  >
                    <div className="text-sm font-mono text-slate-500">
                      {r._id.slice(-6)}
                    </div>

                    <div className="text-slate-200">{r.email}</div>

                    <div className="capitalize">
                      {r.type === "MFI" ? "МФО" : "Банк"}
                    </div>

                    <div>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <div className="space-x-2">
                      {r.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => approveRequest(r._id)}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600"
                          >
                            Одобрить
                          </button>
                          <button
                            onClick={() => rejectRequest(r._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600"
                          >
                            Отклонить
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:hidden space-y-3">
              {requests.map((r) => (
                <div
                  key={r._id}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-mono text-slate-500">
                        ID: {r._id.slice(-6)}
                      </p>
                      <p className="mt-1 text-sm text-slate-200">{r.email}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {r.type === "MFI" ? "МФО" : "Банк"}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        r.status
                      )}`}
                    >
                      {r.status}
                    </span>
                  </div>

                  {r.status === "PENDING" && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => approveRequest(r._id)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-500"
                      >
                        Одобрить
                      </button>
                      <button
                        onClick={() => rejectRequest(r._id)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-500"
                      >
                        Отклонить
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}