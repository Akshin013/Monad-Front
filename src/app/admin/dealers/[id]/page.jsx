"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const ConfirmModal = ({ open, onClose, onConfirm, title, description, confirmLabel, confirmColor }) => {
  if (!open) return null;
  const colors = {
    red: { icon: "bg-red-100", btn: "bg-red-600 hover:bg-red-700", dot: "text-red-600" },
    green: { icon: "bg-green-100", btn: "bg-green-600 hover:bg-green-700", dot: "text-green-600" },
    yellow: { icon: "bg-yellow-100", btn: "bg-yellow-500 hover:bg-yellow-600", dot: "text-yellow-600" },
  };
  const c = colors[confirmColor] || colors.yellow;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-6">{description}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition text-sm">
            Отмена
          </button>
          <button onClick={onConfirm} className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition text-sm ${c.btn}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-medium ${
      type === "success" ? "bg-emerald-600" : "bg-red-600"
    }`}>
      {type === "success" ? "✅" : "❌"} {message}
    </div>
  );
};

const InfoCard = ({ label, value, icon }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{icon} {label}</p>
    <p className="text-slate-100 font-medium">{value || "—"}</p>
  </div>
);

export default function DealerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [dealer, setDealer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchDealer = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dealers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
      setDealer(await res.json());
      setError("");
    } catch (err) {
      setError("Не удалось загрузить данные дилера");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDealer(); }, [id]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const apiAction = async (endpoint, method = "PUT") => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dealers/${id}/${endpoint}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  const handleApprove = () => setModal({
    title: "Одобрить дилера?",
    description: `«${dealer.name}» получит статус APPROVED и будет виден на сайте.`,
    confirmLabel: "Одобрить",
    confirmColor: "green",
    onConfirm: async () => {
      setModal(null); setActionLoading("approve");
      try {
        await apiAction("approve");
        setDealer(d => ({ ...d, status: "APPROVED", is_active: true }));
        showToast("Дилер успешно одобрен");
      } catch { showToast("Не удалось одобрить дилера", "error"); }
      finally { setActionLoading(null); }
    }
  });

  const handleReject = () => setModal({
    title: "Отклонить дилера?",
    description: `«${dealer.name}» получит статус REJECTED и будет скрыт.`,
    confirmLabel: "Отклонить",
    confirmColor: "yellow",
    onConfirm: async () => {
      setModal(null); setActionLoading("reject");
      try {
        await apiAction("reject");
        setDealer(d => ({ ...d, status: "REJECTED", is_active: false }));
        showToast("Дилер отклонён");
      } catch { showToast("Не удалось отклонить", "error"); }
      finally { setActionLoading(null); }
    }
  });

  const handleDelete = () => setModal({
    title: "Удалить дилера?",
    description: `Это необратимо. Дилер «${dealer.name}» и его данные будут удалены навсегда.`,
    confirmLabel: "Удалить",
    confirmColor: "red",
    onConfirm: async () => {
      setModal(null); setActionLoading("delete");
      try {
        await apiAction("", "DELETE");
        showToast("Дилер удалён");
        setTimeout(() => router.back(), 1500);
      } catch { showToast("Не удалось удалить", "error"); setActionLoading(null); }
    }
  });

  const handlePremiumChange = async (e) => {
    const val = e.target.checked;
    setActionLoading("premium");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dealers/${id}/premium`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ isPremium: val }),
      });
      if (!res.ok) throw new Error();
      setDealer(d => ({ ...d, isPremium: val }));
      showToast("Премиум статус обновлён");
    } catch { showToast("Не удалось изменить премиум", "error"); }
    finally { setActionLoading(null); }
  };

  const handleToggleBlock = () => {
    const isActive = dealer.is_active;
    setModal({
      title: isActive ? "Заблокировать дилера?" : "Разблокировать дилера?",
      description: isActive ? `«${dealer.name}» будет скрыт с сайта.` : `«${dealer.name}» снова станет виден.`,
      confirmLabel: isActive ? "Заблокировать" : "Разблокировать",
      confirmColor: isActive ? "red" : "green",
      onConfirm: async () => {
        setModal(null); setActionLoading("block");
        try {
          await apiAction(isActive ? "reject" : "approve");
          setDealer(d => ({ ...d, is_active: !isActive }));
          showToast(isActive ? "Дилер заблокирован" : "Дилер разблокирован");
        } catch { showToast("Не удалось изменить статус", "error"); }
        finally { setActionLoading(null); }
      }
    });
  };

  const statusConfig = {
    APPROVED: { label: "Одобрен", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", dot: "bg-emerald-400" },
    REJECTED: { label: "Отклонён", cls: "bg-red-500/15 text-red-300 border-red-500/30", dot: "bg-red-400" },
    PENDING:  { label: "Ожидает", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30", dot: "bg-amber-400" },
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
    </div>
  );

  if (error || !dealer) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-red-400 text-lg">{error || "Дилер не найден"}</p>
      <button onClick={() => router.back()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Назад</button>
    </div>
  );

  const sc = statusConfig[dealer.status] || statusConfig.PENDING;

  return (
    <>
      {modal && <ConfirmModal open onClose={() => setModal(null)} onConfirm={modal.onConfirm} {...modal} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="min-h-screen py-6 px-4">
        <div className="max-w-3xl mx-auto space-y-4">

          {/* Кнопка назад */}
          <button onClick={() => router.back()} className="flex lg:hidden max-w-18 items-center justify-center gap-2 text-slate-400 hover:text-white transition text-sm mb-2">
            ← 
          </button>

          {/* ШАПКА */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-start gap-5">
              {/* Лого */}
              <div className="flex-shrink-0">
                {dealer.logo?.url ? (
                  <img src={dealer.logo.url} alt={dealer.name} className="w-20 h-20 object-contain rounded-xl bg-slate-800 p-2" />
                ) : (
                  <div className="w-20 h-20 bg-slate-800 rounded-xl flex items-center justify-center text-3xl">🏢</div>
                )}
              </div>

              {/* Инфо */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-white truncate">{dealer.name}</h1>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${sc.cls}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {sc.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mb-3">ID: {dealer._id}</p>

                <div className="flex flex-wrap gap-2">
                  {/* Активность */}
                  <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                    dealer.is_active ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-800 text-slate-400"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dealer.is_active ? "bg-emerald-400" : "bg-slate-500"}`} />
                    {dealer.is_active ? "Активен" : "Неактивен"}
                  </span>

                  {/* Premium toggle */}
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-800 hover:bg-slate-700 transition px-3 py-1 rounded-full">
                    <div className="relative">
                      <input type="checkbox" checked={dealer.isPremium} onChange={handlePremiumChange} className="sr-only" />
                      <div className={`w-8 h-4 rounded-full transition ${dealer.isPremium ? "bg-yellow-400" : "bg-slate-600"}`} />
                      <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${dealer.isPremium ? "translate-x-4" : ""}`} />
                    </div>
                    <span className="text-xs font-medium text-slate-300">⭐ Premium</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ДЕТАЛИ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoCard label="Email владельца" value={dealer.owner?.email} icon="✉️" />
            <InfoCard label="Телефон" value={dealer.contacts?.phone} icon="📞" />
            <InfoCard label="Тип дилера" value={dealer.type} icon="🏷️" />
            <InfoCard label="Страна" value={dealer.country} icon="🌍" />
            {dealer.address && <InfoCard label="Адрес" value={dealer.address} icon="📍" />}
          </div>

          {dealer.description && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">📝 Описание</p>
              <p className="text-slate-300 text-sm leading-relaxed">{dealer.description}</p>
            </div>
          )}

          {/* СТАТИСТИКА */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Просмотры", value: dealer.views || 0, icon: "👁️" },
              { label: "Переходы", value: dealer.externalClicks || 0, icon: "🔗" },
              { label: "Создан", value: new Date(dealer.createdAt).toLocaleDateString(), icon: "📅" },
              { label: "Обновлён", value: new Date(dealer.updatedAt).toLocaleDateString(), icon: "🔄" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-center">
                <p className="text-xl mb-1">{icon}</p>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>

{/* ДЕЙСТВИЯ */}
<div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 shadow-lg">
  
  <div className="flex items-center justify-between mb-5">
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
      Управление дилером
    </p>

    <span className="text-[11px] text-slate-500">
      ID: {dealer.id}
    </span>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

    {/* APPROVE */}
    <button
      onClick={handleApprove}
      disabled={dealer.status === "APPROVED" || !!actionLoading}
      className="group relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                 bg-gradient-to-r from-emerald-500 to-emerald-600
                 hover:from-emerald-400 hover:to-emerald-500
                 text-white text-sm font-semibold transition
                 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {actionLoading === "approve" ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        "✅"
      )}
      Одобрить
    </button>

    {/* REJECT */}
    <button
      onClick={handleReject}
      disabled={dealer.status === "REJECTED" || !!actionLoading}
      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                 bg-gradient-to-r from-amber-500 to-orange-500
                 hover:from-amber-400 hover:to-orange-400
                 text-white text-sm font-semibold transition
                 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {actionLoading === "reject" ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        "❌"
      )}
      Отклонить
    </button>

    {/* BLOCK */}
    <button
      onClick={handleToggleBlock}
      disabled={!!actionLoading}
      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl
        text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed
        ${
          dealer.is_active
            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white"
            : "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white"
        }`}
    >
      {actionLoading === "block" ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : dealer.is_active ? (
        "🔒"
      ) : (
        "🔓"
      )}
      {dealer.is_active ? "Блокировать" : "Разблокировать"}
    </button>

    {/* DELETE (опасная зона) */}
    <button
      onClick={handleDelete}
      disabled={!!actionLoading}
      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                 bg-transparent border border-red-500/40
                 text-red-400 hover:bg-red-500/10 hover:border-red-400
                 text-sm font-semibold transition
                 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {actionLoading === "delete" ? (
        <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        "🗑️"
      )}
      Удалить
    </button>
  </div>

  {/* предупреждение */}
  <p className="mt-4 text-xs text-slate-500">
    ⚠️ Опасные действия требуют подтверждения
  </p>
</div>
        </div>
      </div>
    </>
  );
}