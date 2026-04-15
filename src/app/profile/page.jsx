"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import {
  FaEnvelope,
  FaPhone,
  FaTimes,
  FaPlus,
  FaEdit,
  FaMapMarkerAlt,
  FaClock,
  FaCalendar,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaSyncAlt,
  FaBell,
} from "react-icons/fa";

// const API = "http://localhost:5000/api";
const API = `${process.env.NEXT_PUBLIC_API_URL}`;
// console.log(API);

const POLL_INTERVAL = 10_000;
 
// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            animation: "slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
          className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold pointer-events-auto
            ${
              t.type === "success"
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                : t.type === "info"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                  : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
            }`}
        >
          {t.type === "success" ? (
            <FaCheckCircle className="flex-shrink-0" />
          ) : t.type === "info" ? (
            <FaBell className="flex-shrink-0" />
          ) : (
            <FaTimesCircle className="flex-shrink-0" />
          )}
          <span>{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="ml-2 opacity-70 hover:opacity-100"
          >
            <FaTimes size={11} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = {
    APPROVED: {
      icon: <FaCheckCircle />,
      label: "Одобрен",
      cls: "from-emerald-500 to-green-600 text-white",
      pulse: "bg-emerald-400",
    },
    PENDING: {
      icon: <FaHourglassHalf />,
      label: "На модерации",
      cls: "from-amber-500 to-yellow-600 text-slate-900",
      pulse: "bg-amber-400",
    },
    REJECTED: {
      icon: <FaTimesCircle />,
      label: "Отклонён",
      cls: "from-red-500 to-rose-600 text-white",
      pulse: "bg-red-400",
    },
  };
  const c = cfg[status] || cfg.PENDING;
  return (
    <span
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-lg bg-gradient-to-r ${c.cls}`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.pulse} opacity-75`}
        />
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${c.pulse}`}
        />
      </span>
      {c.icon} {c.label}
    </span>
  );
}

// ─── POLLING COUNTDOWN ────────────────────────────────────────────────────────
function PollingIndicator({ secondsLeft, onRefresh, isRefreshing }) {
  const pct =
    ((POLL_INTERVAL / 1000 - secondsLeft) / (POLL_INTERVAL / 1000)) * 100;
  return (
    <div className="flex items-center gap-3 text-xs text-slate-400">
      <div className="relative w-7 h-7">
        <svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28">
          <circle
            cx="14"
            cy="14"
            r="11"
            fill="none"
            stroke="#334155"
            strokeWidth="3"
          />
          <circle
            cx="14"
            cy="14"
            r="11"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 11}`}
            strokeDashoffset={`${2 * Math.PI * 11 * (1 - pct / 100)}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-amber-400">
          {secondsLeft}
        </span>
      </div>
      <span>авто-обновление</span>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-600/60 text-slate-200 transition-all disabled:opacity-50"
      >
        <FaSyncAlt className={isRefreshing ? "animate-spin" : ""} size={11} />
        Обновить
      </button>
    </div>
  );
}

// ─── MODERATION WAITING BANNER ────────────────────────────────────────────────
function ModerationBanner() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
          <FaHourglassHalf className="animate-pulse text-amber-400" />
        </div>
      </div>
      <div>
        <p className="font-semibold text-sm">Ожидаем решения администратора</p>
        <p className="text-xs text-amber-300/70 mt-0.5">
          Статус обновится автоматически, как только администратор примет
          решение
        </p>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, loading } = useAuth();

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDealerModalOpen, setIsDealerModalOpen] = useState(false);
  const [dealerProfile, setDealerProfile] = useState(null);
  const [dealerProducts, setDealerProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [activeType, setActiveType] = useState("ALL");

  const [logoFile, setLogoFile] = useState(null);
  const [logoData, setLogoData] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // new states for dealer banners/covers
  const [coversFiles, setCoversFiles] = useState([]);
  const [coversPreview, setCoversPreview] = useState([]);
  const [uploadingCovers, setUploadingCovers] = useState(false);

  // Polling state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(POLL_INTERVAL / 1000);
  const prevStatus = useRef(null);

  // Toast
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4500,
    );
  }, []);
  const dismissToast = useCallback(
    (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    [],
  );

  // Dealer form
  const [dealerForm, setDealerForm] = useState({
    name: "",
    type: "BANK",
    country: "AZ",
    description: "",
    contacts: { phone: "", email: "" },
    address: "",
    workingHours: "",
    workingDays: "",
  });

  // Product form
  const [productForm, setProductForm] = useState({
    category: "CARD",
    subtype: "DEBIT_CARD",
    title: "",
    description: "",
    currency: "AZN",
    card: {
      creditLimit: "",
      cashbackPercent: "",
      annualFee: "",
      freeService: false,
      cardNetwork: "VISA",
      websiteUrl: "",
    },
    credit: {
      interestRateFrom: "",
      interestRateTo: "",
      minAmount: "",
      maxAmount: "",
      minTerm: "",
      maxTerm: "",
      websiteUrl: "",
    },
    insurance: { shortDescription: "", basePrice: "", websiteUrl: "" },
  });

  // если профиль MFI/БОКТ, сразу готовим кредитную категорию
  useEffect(() => {
    if (dealerProfile?.type === "MFI") {
      setProductForm((p) => ({
        ...p,
        category: "CREDIT",
        subtype: "CONSUMER_LOAN",
      }));
    }
  }, [dealerProfile?.type]);

  const PRODUCT_LABELS = {
    DEBIT_CARD: "Дебетовая карта",
    CREDIT_CARD: "Кредитная карта",
    CONSUMER_LOAN: "Потребительский кредит",
    AUTO_LOAN: "Автокредит",
    MORTGAGE: "Ипотека",
    SECURED_LOAN: "Кредит под залог",
    BUSINESS_LOAN: "Кредит для бизнеса",
    REFINANCE: "Рефинансирование",
    AUTO_INSURANCE: "Автострахование",
    PROPERTY_INSURANCE: "Страхование недвижимости",
    LIFE_INSURANCE: "Страхование жизни",
  };

  const insuranceTypes =
    dealerProfile?.type === "MFI"
      ? [{ key: "CREDIT", label: "Кредиты", icon: "💰" }]
      : [
          { key: "ALL", label: "Все", icon: "📋" },
          { key: "CARD", label: "Карты", icon: "💳" },
          { key: "CREDIT", label: "Кредиты", icon: "💰" },
          { key: "INSURANCE", label: "Страховки", icon: "🛡️" },
        ];

  const filteredProducts =
    activeType === "ALL"
      ? dealerProducts
      : dealerProducts.filter((p) => p?.category === activeType);

  // если профиль MFI, фиксируем activeType в CREDIT
  useEffect(() => {
    if (dealerProfile?.type === "MFI") {
      setActiveType("CREDIT");
    }
  }, [dealerProfile?.type]);

  // ── FETCH DEALER ────────────────────────────────────────────────────────────
  const fetchDealerProfile = useCallback(
    async (silent = false) => {
      const token = localStorage.getItem("token");
      if (!token) return;
      if (!silent) setIsRefreshing(true);
      try {
        const res = await fetch(`${API}/dealers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setDealerProfile(null);
          return;
        }

        const newStatus = data.status;

        // Notify on status change
        if (prevStatus.current && prevStatus.current !== newStatus) {
          if (newStatus === "APPROVED")
            addToast("🎉 Ваш профиль одобрен администратором!", "success");
          else if (newStatus === "REJECTED")
            addToast("❌ Ваш профиль был отклонён. Проверьте данные.", "error");
          else addToast(`Статус профиля изменён на: ${newStatus}`, "info");
        }
        prevStatus.current = newStatus;

        setDealerProfile({
          _id: data._id,
          name: data.name || "",
          type: data.type || "",
          country: data.country || "AZ",
          status: data.status || "PENDING",
          contacts: data.contacts || {},
          address: data.address || "",
          workingHours: data.workingHours || "",
          workingDays: data.workingDays || "",
          description: data.description || "",
          logo: data.logo || null,
          covers: data.covers || [],
        });

        if (data.logo?.url) {
          setLogoData(data.logo.url);
          setLogoPreview(data.logo.url);
        }
        // no preview for covers here; we just keep URLs in dealerProfile

        setDealerForm({
          name: data.name || "",
          type: data.type || "BANK",
          country: data.country || "AZ",
          description: data.description || "",
          contacts: {
            phone: data.contacts?.phone || "",
            email: data.contacts?.email || "",
          },
          address: data.address || "",
          workingHours: data.workingHours || "",
          workingDays: data.workingDays || "",
        });
      } catch (err) {
        console.error(err);
        if (!silent) addToast("Не удалось загрузить профиль", "error");
      } finally {
        setIsRefreshing(false);
        setSecondsLeft(POLL_INTERVAL / 1000);
      }
    },
    [addToast],
  );

  const fetchDealerProducts = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API}/products/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setDealerProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // ── POLLING ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || user.role !== "DEALER") return;
    fetchDealerProfile(false);

    // Countdown ticker
    const ticker = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          fetchDealerProfile(true);
          return POLL_INTERVAL / 1000;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(ticker);
  }, [user, fetchDealerProfile]);

  // ── WEBSOCKET ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || user.role !== "DEALER") return;
    let ws;
    let reconnectTimeout;

    const connect = () => {
      try {
        ws = new WebSocket(`${WS_URL}?token=${localStorage.getItem("token")}`);

        ws.onopen = () => console.log("[WS] connected");

        ws.onmessage = (e) => {
          try {
            const msg = JSON.parse(e.data);
            if (msg.type === "DEALER_STATUS_CHANGED" && msg.dealerId) {
              fetchDealerProfile(true);
            }
          } catch {}
        };

        ws.onerror = () => {};
        ws.onclose = () => {
          // Auto-reconnect after 5s
          reconnectTimeout = setTimeout(connect, 5000);
        };
      } catch {}
    };

    connect();
    return () => {
      ws?.close();
      clearTimeout(reconnectTimeout);
    };
  }, [user, fetchDealerProfile]);

  useEffect(() => {
    if (dealerProfile?._id) fetchDealerProducts();
  }, [dealerProfile?._id, fetchDealerProducts]);

  // ── HANDLERS ─────────────────────────────────────────────────────────────────
  const handleManualRefresh = () => {
    fetchDealerProfile(false);
  };

  const handleDealerChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("contacts.")) {
      const field = name.split(".")[1];
      setDealerForm((p) => ({
        ...p,
        contacts: { ...p.contacts, [field]: value },
      }));
    } else {
      setDealerForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleCreateOrUpdateDealer = async () => {
    const token = localStorage.getItem("token");
    const method = dealerProfile ? "PUT" : "POST";
    try {
      const res = await fetch(`${API}/dealers/me`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dealerForm),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Ошибка сохранения", "error");
        return;
      }
      addToast(
        dealerProfile
          ? "✅ Профиль обновлён!"
          : "✅ Профиль создан и отправлен на модерацию!",
        "success",
      );
      setIsDealerModalOpen(false);
      fetchDealerProfile(false);
    } catch {
      addToast("Ошибка сервера", "error");
    }
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (
      ["title", "description", "category", "subtype", "currency"].includes(name)
    ) {
      setProductForm((p) => ({ ...p, [name]: value }));
      return;
    }
    const section = productForm.category.toLowerCase();
    setProductForm((p) => ({
      ...p,
      [section]: {
        ...p[section],
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleCreateProduct = async () => {
    const token = localStorage.getItem("token");
    const toNum = (v) => (v === "" || v == null ? undefined : Number(v));
    const clean = (obj) => {
      Object.keys(obj).forEach((k) => {
        if (obj[k] === "" || obj[k] == null) delete obj[k];
        else if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
          clean(obj[k]);
          if (!Object.keys(obj[k]).length) delete obj[k];
        }
      });
    };
    const payload = {
      category: productForm.category,
      subtype: productForm.subtype,
      title: productForm.title?.trim(),
      description: productForm.description?.trim(),
      currency: productForm.currency || "AZN",
    };
    if (productForm.category === "CARD")
      payload.card = {
        ...productForm.card,
        creditLimit: toNum(productForm.card.creditLimit),
        cashbackPercent: toNum(productForm.card.cashbackPercent),
        annualFee: toNum(productForm.card.annualFee),
      };
    if (productForm.category === "CREDIT")
      payload.credit = {
        ...productForm.credit,
        interestRateFrom: toNum(productForm.credit.interestRateFrom),
        interestRateTo: toNum(productForm.credit.interestRateTo),
        minAmount: toNum(productForm.credit.minAmount),
        maxAmount: toNum(productForm.credit.maxAmount),
        minTerm: toNum(productForm.credit.minTerm),
        maxTerm: toNum(productForm.credit.maxTerm),
      };
    if (productForm.category === "INSURANCE")
      payload.insurance = {
        ...productForm.insurance,
        basePrice: toNum(productForm.insurance.basePrice),
      };
    clean(payload);
    try {
      const res = await fetch(`${API}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || data.message || "Ошибка", "error");
        return;
      }
      addToast("Продукт отправлен на модерацию ✅", "success");
      setIsProductModalOpen(false);
      fetchDealerProducts();
    } catch {
      addToast("Ошибка сервера", "error");
    }
  };

  const handleLogoChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setLogoFile(f);
    setLogoPreview(URL.createObjectURL(f));
  };
  const handleUploadLogo = async () => {
    if (!logoFile) return;
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("logo", logoFile);
      const res = await fetch(`${API}/dealers/logo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      addToast("🏦 Логотип обновлён!", "success");
      setLogoFile(null);
      fetchDealerProfile(false);
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setUploadingLogo(false);
    }
  };

  // covers handlers
  const handleCoversChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setCoversFiles(files);
    setCoversPreview(files.map((f) => URL.createObjectURL(f)));
  };

  const handleUploadCovers = async () => {
    if (!coversFiles.length) return;
    setUploadingCovers(true);
    try {
      const fd = new FormData();
      coversFiles.forEach((f) => fd.append("covers", f));
      const res = await fetch(`${API}/dealers/covers`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка загрузки баннеров");
      addToast("Баннеры обновлены!", "success");
      setCoversFiles([]);
      setCoversPreview([]);
      fetchDealerProfile(false);
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setUploadingCovers(false);
    }
  };

  const getProductLabel = (v) => PRODUCT_LABELS[v] || v || "—";

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300 text-lg font-medium">
            Загрузка профиля...
          </p>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="bg-red-950/50 border border-red-500/30 rounded-2xl p-8">
          <p className="text-red-300 text-lg">
            Пользователь не найден. Войдите в аккаунт.
          </p>
        </div>
      </div>
    );

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

  return (
    <>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
      `}</style>

      {/* ── TOASTS ── */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex justify-center items-start p-4 md:p-8">
        <div className="w-full max-w-6xl">
          <div className="bg-gradient-to-br from-slate-800/80 to-blue-900/60 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-700/50 overflow-hidden">
            <div className="p-8 space-y-8">
              {/* ── HEADER ── */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 pb-8 border-b border-slate-700/50">
                {/* Logo Upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-yellow-500/30 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition" />
                    <label className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-amber-400 shadow-xl cursor-pointer flex items-center justify-center bg-white/10 backdrop-blur-sm">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Логотип"
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-4xl">🏦</span>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium px-2 text-center">
                        Нажмите для смены
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleLogoChange}
                      />
                    </label>
                  </div>
                  {logoFile && (
                    <button
                      disabled={uploadingLogo}
                      onClick={handleUploadLogo}
                      className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition shadow-lg disabled:opacity-50 text-sm font-semibold"
                    >
                      {uploadingLogo ? "Загрузка..." : "Сохранить лого"}
                    </button>
                  )}

                  {/* Covers uploader (баннеры) */}
                  {dealerProfile && (
                    <div className="mt-6 w-full max-w-xs text-center">
                      <p className="text-sm font-semibold mb-2">
                        Баннеры (макс. 3)
                      </p>
                      <p className="text-xs text-gray-400 mb-2">
                        Новые изображения заменят текущие
                      </p>
                      <div className="flex gap-2 mb-2 flex-wrap justify-center">
                        {(dealerProfile.covers || []).map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt={`Banner ${i + 1}`}
                            className="h-20 w-20 object-cover rounded-lg"
                          />
                        ))}
                        {coversPreview.map((url, i) => (
                          <img
                            key={`new${i}`}
                            src={url}
                            alt={`Preview ${i + 1}`}
                            className="h-20 w-20 object-cover rounded-lg border-2 border-amber-400"
                          />
                        ))}
                      </div>
                      <label className="inline-block">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={handleCoversChange}
                        />
                        <span className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition">
                          Выбрать картинки
                        </span>
                      </label>
                      {coversFiles.length > 0 && (
                        <button
                          disabled={uploadingCovers}
                          onClick={handleUploadCovers}
                          className="ml-2 mt-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition shadow-lg disabled:opacity-50 text-sm font-semibold"
                        >
                          {uploadingCovers ? "Загрузка..." : "Сохранить баннеры"}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* User info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent mb-2">
                    {fullName}
                  </h1>
                  <div className="inline-block px-4 py-1.5 bg-blue-900/50 border border-blue-500/30 rounded-full mb-4">
                    <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">
                      {user.role}
                    </p>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <p className="flex items-center justify-center md:justify-start gap-2">
                      <FaEnvelope className="text-amber-400" /> {user.email}
                    </p>
                    {user.phone && (
                      <p className="flex items-center justify-center md:justify-start gap-2">
                        <FaPhone className="text-amber-400" /> {user.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 items-end">
                  <button
                    onClick={() => setIsDealerModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-amber-50 text-slate-900 rounded-xl transition shadow-lg font-bold"
                  >
                    <FaEdit />
                    {dealerProfile ? "Редактировать" : "Создать профиль"}
                  </button>

                  {/* Polling indicator */}
                  {user.role === "DEALER" && (
                    <PollingIndicator
                      secondsLeft={secondsLeft}
                      onRefresh={handleManualRefresh}
                      isRefreshing={isRefreshing}
                    />
                  )}
                </div>
              </div>

              {/* ── DEALER SECTION ── */}
              {user.role === "DEALER" && (
                <div className="space-y-6">
                  {dealerProfile ? (
                    <div className="bg-gradient-to-br from-slate-800/60 to-blue-900/40 rounded-2xl p-8 border border-slate-600/30 backdrop-blur-sm">
                      {/* Status header */}
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                            {dealerProfile.name}
                          </h3>
                          {dealerProfile.isPremium && (
                            <span className="ml-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded">
                              ⭐ Премиум
                            </span>
                          )}
                        </div>
                        <StatusBadge status={dealerProfile.status} />
                      </div>

                      {/* Moderation waiting */}
                      {dealerProfile.status === "PENDING" && (
                        <ModerationBanner />
                      )}

                      {/* Info grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-200 mt-6">
                        {[
                          {
                            label: "Тип",
                            value:
                              dealerProfile.type === "BANK"
                                ? "🏦 Банк"
                                : dealerProfile.type === "INSURANCE"
                                  ? "🛡️ Страховая"
                                  : "💰 МФО",
                          },
                          { label: "Страна", value: dealerProfile.country },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="bg-slate-900/30 rounded-xl p-4 border border-slate-700/30"
                          >
                            <p className="text-sm text-slate-400 mb-1">
                              {label}
                            </p>
                            <p className="font-semibold text-lg">{value}</p>
                          </div>
                        ))}
                        {dealerProfile.contacts?.phone && (
                          <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-700/30">
                            <p className="text-sm text-slate-400 mb-1">
                              Телефон
                            </p>
                            <p className="font-semibold flex items-center gap-2">
                              <FaPhone className="text-amber-400" />{" "}
                              {dealerProfile.contacts.phone}
                            </p>
                          </div>
                        )}
                        {dealerProfile.contacts?.email && (
                          <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-700/30">
                            <p className="text-sm text-slate-400 mb-1">Email</p>
                            <p className="font-semibold flex items-center gap-2">
                              <FaEnvelope className="text-amber-400" />{" "}
                              {dealerProfile.contacts.email}
                            </p>
                          </div>
                        )}
                        {dealerProfile.address && (
                          <div className="md:col-span-2 bg-slate-900/30 rounded-xl p-4 border border-slate-700/30">
                            <p className="text-sm text-slate-400 mb-1">Адрес</p>
                            <p className="font-semibold flex items-center gap-2">
                              <FaMapMarkerAlt className="text-amber-400" />{" "}
                              {dealerProfile.address}
                            </p>
                          </div>
                        )}
                        {dealerProfile.workingHours && (
                          <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-700/30">
                            <p className="text-sm text-slate-400 mb-1">
                              Часы работы
                            </p>
                            <p className="font-semibold flex items-center gap-2">
                              <FaClock className="text-amber-400" />{" "}
                              {dealerProfile.workingHours}
                            </p>
                          </div>
                        )}
                        {dealerProfile.workingDays && (
                          <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-700/30">
                            <p className="text-sm text-slate-400 mb-1">
                              Рабочие дни
                            </p>
                            <p className="font-semibold flex items-center gap-2">
                              <FaCalendar className="text-amber-400" />{" "}
                              {dealerProfile.workingDays}
                            </p>
                          </div>
                        )}
                      </div>
                      {dealerProfile.description && (
                        <div className="mt-6 pt-6 border-t border-slate-700/30">
                          <p className="text-sm text-slate-400 mb-2">
                            Описание
                          </p>
                          <p className="text-slate-200 leading-relaxed">
                            {dealerProfile.description}
                          </p>
                        </div>
                      )}
                      {dealerProfile.status === "APPROVED" && (
                        <div className="mt-8">
                          <button
                            onClick={() => {
                              // prefill category for MFI/BOKT dealers
                              setProductForm((prev) => ({
                                ...prev,
                                category:
                                  dealerProfile?.type === "MFI"
                                    ? "CREDIT"
                                    : prev.category,
                                subtype:
                                  dealerProfile?.type === "MFI"
                                    ? "CONSUMER_LOAN"
                                    : prev.subtype,
                              }));
                              setIsProductModalOpen(true);
                            }}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl transition shadow-xl font-bold text-lg"
                          >
                            <FaPlus className="text-xl" /> Добавить продукт
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/20 border-2 border-amber-500/30 rounded-2xl p-8 text-center">
                      <span className="text-4xl">📋</span>
                      <p className="text-amber-200 mb-6 text-lg mt-4">
                        У вас ещё нет профиля дилера.
                      </p>
                      <button
                        onClick={() => setIsDealerModalOpen(true)}
                        className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-900 rounded-xl font-bold text-lg shadow-xl transition"
                      >
                        Создать профиль дилера
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Bio */}
              <div className="bg-gradient-to-br from-slate-800/40 to-blue-900/30 rounded-2xl p-6 border border-slate-700/30">
                <h2 className="text-xl font-bold text-slate-100 mb-3 flex items-center gap-2">
                  <span>✍️</span> О себе
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  {user.bio || "Пользователь не заполнил информацию о себе."}
                </p>
              </div>

              {/* Products */}
              {dealerProfile && (
                <div className="mt-8">
                  <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                    📦 Продукты дилера
                  </h2>
                  {/* FILTER */}
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <ul className="flex flex-wrap justify-center gap-3 mb-8">
                      {insuranceTypes.map((type) => (
                        <li
                          key={type.key}
                          onClick={() => setActiveType(type.key)}
                          className={`cursor-pointer px-4 py-2 rounded-full font-medium transition ${
                            activeType === type.key
                              ? "bg-blue-600 text-white shadow"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {type.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {loadingProducts ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-slate-400">Загрузка продуктов...</p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                      <p className="text-slate-400 text-lg">
                        Нет продуктов в этой категории
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredProducts.map((product) => (
                        <div
                          key={product._id}
                          className="group bg-gradient-to-br from-slate-800/60 to-blue-900/40 border border-slate-600/30 rounded-2xl p-4 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 backdrop-blur-sm"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-slate-100 group-hover:text-amber-300 transition-colors">
                              {product.title}
                            </h3>
                            <StatusBadge status={product.status} />
                          </div>
                          <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                            {product.description || "Без описания"}
                          </p>
                          <div className="space-y-1 text-xs text-slate-300 mb-2">
                            {[
                              ["Категория", getProductLabel(product.category)],
                              ["Подтип", getProductLabel(product.subtype)],
                              ["Валюта", product.currency],
                            ].map(([k, v]) => (
                              <div
                                key={k}
                                className="flex items-center gap-1 bg-slate-900/30 rounded-lg px-2 py-1"
                              >
                                <span className="font-semibold text-amber-400">
                                  {k}:
                                </span>
                                <span>{v}</span>
                              </div>
                            ))}
                          </div>
                          {product.category === "CARD" && product.card && (
                            <div className="mt-2 p-3 bg-blue-900/30 rounded-xl border border-blue-500/30 space-y-1 text-xs">
                              <p className="flex justify-between">
                                <span className="text-slate-400">
                                  💳 Лимит:
                                </span>
                                <span className="font-semibold text-blue-300">
                                  {product.card.creditLimit || "—"}
                                </span>
                              </p>
                              <p className="flex justify-between">
                                <span className="text-slate-400">
                                  🎁 Кэшбек:
                                </span>
                                <span className="font-semibold text-blue-300">
                                  {product.card.cashbackPercent || "—"}%
                                </span>
                              </p>
                              <p className="flex justify-between">
                                <span className="text-slate-400">
                                  💰 Годовая:
                                </span>
                                <span className="font-semibold text-blue-300">
                                  {product.card.annualFee || "—"}
                                </span>
                              </p>
                            </div>
                          )}
                          {product.category === "CREDIT" && product.credit && (
                            <div className="mt-2 p-3 bg-emerald-900/30 rounded-xl border border-emerald-500/30 space-y-1 text-xs">
                              <p className="flex justify-between">
                                <span className="text-slate-400">
                                  💰 Сумма:
                                </span>
                                <span className="font-semibold text-emerald-300">
                                  {product.credit.minAmount || "—"} —{" "}
                                  {product.credit.maxAmount || "—"}
                                </span>
                              </p>
                              <p className="flex justify-between">
                                <span className="text-slate-400">
                                  📈 Ставка:
                                </span>
                                <span className="font-semibold text-emerald-300">
                                  {product.credit.interestRateFrom || "—"}% —{" "}
                                  {product.credit.interestRateTo || "—"}%
                                </span>
                              </p>
                              <p className="flex justify-between">
                                <span className="text-slate-400">⏳ Срок:</span>
                                <span className="font-semibold text-emerald-300">
                                  {product.credit.minTerm || "—"} —{" "}
                                  {product.credit.maxTerm || "—"} мес
                                </span>
                              </p>
                            </div>
                          )}
                          {product.category === "INSURANCE" &&
                            product.insurance && (
                              <div className="mt-2 p-3 bg-purple-900/30 rounded-xl border border-purple-500/30 space-y-1 text-xs">
                                <p className="flex justify-between">
                                  <span className="text-slate-400">
                                    🛡️ Цена:
                                  </span>
                                  <span className="font-semibold text-purple-300">
                                    {product.insurance.basePrice || "—"}{" "}
                                    {product.currency}
                                  </span>
                                </p>
                                <p className="text-slate-400">
                                  📄{" "}
                                  {product.insurance.shortDescription ||
                                    "Без описания"}
                                </p>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── DEALER MODAL ── */}
      {isDealerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-gradient-to-br from-slate-800 to-blue-950 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-2 border-amber-500/30 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-blue-900 border-b-2 border-amber-500/30 px-8 py-6 rounded-t-3xl z-10 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  {dealerProfile
                    ? "Редактировать профиль"
                    : "Создать профиль дилера"}
                </h2>
                <button
                  onClick={() => setIsDealerModalOpen(false)}
                  className="text-slate-400 hover:text-amber-400 transition p-3 hover:bg-slate-700/50 rounded-xl"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>
            <div className="px-8 py-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    label: "Название организации *",
                    name: "name",
                    span: 2,
                    placeholder: "Kapital Bank",
                  },
                  {
                    label: "Адрес",
                    name: "address",
                    span: 2,
                    placeholder: "г. Баку, ул. Физули 71",
                  },
                  {
                    label: "Телефон",
                    name: "contacts.phone",
                    placeholder: "+994 12 404 44 44",
                  },
                  {
                    label: "Email",
                    name: "contacts.email",
                    type: "email",
                    placeholder: "info@bank.az",
                  },
                  {
                    label: "Часы работы",
                    name: "workingHours",
                    placeholder: "09:00 - 18:00",
                  },
                  {
                    label: "Рабочие дни",
                    name: "workingDays",
                    placeholder: "Пн-Пт",
                  },
                ].map(({ label, name, span, placeholder, type }) => (
                  <div key={name} className={span === 2 ? "sm:col-span-2" : ""}>
                    <label className="block text-sm font-semibold text-amber-300 mb-2">
                      {label}
                    </label>
                    <input
                      type={type || "text"}
                      name={name}
                      placeholder={placeholder}
                      value={
                        name.includes(".")
                          ? dealerForm.contacts[name.split(".")[1]]
                          : dealerForm[name]
                      }
                      onChange={handleDealerChange}
                      className="w-full bg-slate-900/50 border-2 border-slate-600/50 focus:border-amber-500 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-amber-300 mb-2">
                    Тип *
                  </label>
                  <select
                    name="type"
                    value={dealerForm.type}
                    onChange={handleDealerChange}
                    className="w-full bg-slate-900/50 border-2 border-slate-600/50 focus:border-amber-500 px-4 py-3 rounded-xl text-white focus:ring-2 focus:ring-amber-500/20 transition-all"
                  >
                    <option value="BANK">🏦 Банк</option>
                    <option value="INSURANCE">🛡️ Страховая компания</option>
                    <option value="MFI">💰 МФО</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-amber-300 mb-2">
                    Страна *
                  </label>
                  <select
                    name="country"
                    value={dealerForm.country}
                    onChange={handleDealerChange}
                    className="w-full bg-slate-900/50 border-2 border-slate-600/50 focus:border-amber-500 px-4 py-3 rounded-xl text-white focus:ring-2 focus:ring-amber-500/20 transition-all"
                  >
                    <option value="AZ">🇦🇿 Азербайджан</option>
                    <option value="RU">🇷🇺 Россия</option>
                    <option value="TR">🇹🇷 Турция</option>
                    <option value="GE">🇬🇪 Грузия</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-amber-300 mb-2">
                    Описание
                  </label>
                  <textarea
                    name="description"
                    value={dealerForm.description}
                    onChange={handleDealerChange}
                    placeholder="Краткое описание вашей организации..."
                    rows={3}
                    className="w-full bg-slate-900/50 border-2 border-slate-600/50 focus:border-amber-500 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gradient-to-r from-slate-800 to-blue-900 border-t-2 border-amber-500/30 px-8 py-6 rounded-b-3xl backdrop-blur-xl">
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-4">
                <button
                  onClick={() => setIsDealerModalOpen(false)}
                  className="w-full sm:w-auto px-8 py-3 border-2 border-slate-600 rounded-xl hover:bg-slate-700/50 transition font-semibold text-slate-300 hover:text-white"
                >
                  Отмена
                </button>
                <button
                  onClick={handleCreateOrUpdateDealer}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-900 rounded-xl transition shadow-xl font-bold"
                >
                  {dealerProfile ? "Сохранить изменения" : "Создать профиль"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCT MODAL ── */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-gradient-to-br from-slate-800 to-blue-950 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-amber-500/30 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-blue-900 border-b-2 border-amber-500/30 px-8 py-6 rounded-t-3xl z-10 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">
                  Добавить продукт
                </h2>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="text-slate-400 hover:text-amber-400 transition p-3 hover:bg-slate-700/50 rounded-xl"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>
            <div className="px-8 py-8 space-y-8">
              <section className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-amber-300 mb-2">
                    Название продукта *
                  </label>
                  <input
                    name="title"
                    value={productForm.title}
                    onChange={handleProductChange}
                    placeholder="Например: Премиум Карта"
                    className="w-full bg-slate-900/50 border-2 border-slate-600/50 focus:border-amber-500 px-4 py-3 rounded-xl text-white placeholder-slate-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-amber-300 mb-2">
                    Описание
                  </label>
                  <textarea
                    name="description"
                    value={productForm.description}
                    onChange={handleProductChange}
                    rows={3}
                    placeholder="Подробное описание..."
                    className="w-full bg-slate-900/50 border-2 border-slate-600/50 focus:border-amber-500 px-4 py-3 rounded-xl text-white placeholder-slate-500 transition resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(() => {
                    const categoryOpts =
                      dealerProfile?.type === "MFI"
                        ? [["CREDIT", "💰 Кредит"]]
                        : [
                            ["CARD", "💳 Карта"],
                            ["CREDIT", "💰 Кредит"],
                            ["INSURANCE", "🛡️ Страховка"],
                          ];
                    return [
                      {
                        label: "Категория *",
                        name: "category",
                        opts: categoryOpts,
                      },
                      {
                        label: "Валюта",
                        name: "currency",
                        opts: [
                          ["AZN", "AZN"],
                          ["USD", "USD"],
                          ["EUR", "EUR"],
                        ],
                      },
                    ].map(({ label, name, opts }) => (
                      <div key={name}>
                        <label className="block text-sm font-semibold text-amber-300 mb-2">
                          {label}
                        </label>
                        <select
                          name={name}
                          value={productForm[name]}
                          onChange={handleProductChange}
                          className="w-full bg-slate-900/50 border-2 border-slate-600/50 focus:border-amber-500 px-4 py-3 rounded-xl text-white transition"
                        >
                          {opts.map(([v, l]) => (
                            <option key={v} value={v}>
                              {l}
                            </option>
                          ))}
                        </select>
                      </div>
                    ));
                  })()}
                  <div>
                    <label className="block text-sm font-semibold text-amber-300 mb-2">
                      Подтип *
                    </label>
                    <select
                      name="subtype"
                      value={productForm.subtype}
                      onChange={handleProductChange}
                      className="w-full bg-slate-900/50 border-2 border-slate-600/50 focus:border-amber-500 px-4 py-3 rounded-xl text-white transition"
                    >
                      {productForm.category === "CARD" && (
                        <>
                          <option value="DEBIT_CARD">Дебетовая</option>
                          <option value="CREDIT_CARD">Кредитная</option>
                        </>
                      )}
                      {productForm.category === "CREDIT" && (
                        <>
                          <option value="CONSUMER_LOAN">Потребительский</option>
                          <option value="AUTO_LOAN">Авто</option>
                          <option value="MORTGAGE">Ипотека</option>
                          <option value="SECURED_LOAN">Залог</option>
                          <option value="BUSINESS_LOAN">Бизнес</option>
                          <option value="REFINANCE">Рефинансирование</option>
                        </>
                      )}
                      {productForm.category === "INSURANCE" && (
                        <>
                          <option value="AUTO_INSURANCE">Авто</option>
                          <option value="PROPERTY_INSURANCE">Имущество</option>
                          <option value="LIFE_INSURANCE">Жизнь</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </section>

              {productForm.category === "CARD" && (
                <section className="bg-blue-900/30 rounded-2xl p-6 border-2 border-blue-500/30 space-y-4">
                  <h3 className="text-xl font-bold text-blue-300">
                    💳 Параметры карты
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      ["creditLimit", "Кредитный лимит", "10000"],
                      ["cashbackPercent", "Кэшбек (%)", "5"],
                      ["annualFee", "Годовое обслуживание", "0"],
                    ].map(([name, label, ph]) => (
                      <div key={name}>
                        <label className="block text-sm font-semibold text-blue-300 mb-2">
                          {label}
                        </label>
                        <input
                          type="number"
                          name={name}
                          value={productForm.card[name]}
                          onChange={handleProductChange}
                          placeholder={ph}
                          className="w-full bg-slate-900/50 border-2 border-blue-600/50 focus:border-blue-400 px-4 py-3 rounded-xl text-white placeholder-slate-500 transition"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-semibold text-blue-300 mb-2">
                        Платёжная система
                      </label>
                      <select
                        name="cardNetwork"
                        value={productForm.card.cardNetwork}
                        onChange={handleProductChange}
                        className="w-full bg-slate-900/50 border-2 border-blue-600/50 px-4 py-3 rounded-xl text-white transition"
                      >
                        <option value="VISA">VISA</option>
                        <option value="MASTERCARD">Mastercard</option>
                        <option value="MIR">МИР</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-blue-300 mb-2">
                        Ссылка на сайт
                      </label>
                      <input
                        type="url"
                        name="websiteUrl"
                        value={productForm.card.websiteUrl}
                        onChange={handleProductChange}
                        placeholder="https://bank.com/card"
                        className="w-full bg-slate-900/50 border-2 border-blue-600/50 px-4 py-3 rounded-xl text-white placeholder-slate-500 transition"
                      />
                    </div>
                    <label className="sm:col-span-2 flex items-center gap-3 cursor-pointer bg-blue-900/30 p-4 rounded-xl hover:bg-blue-900/50 transition border border-blue-500/20">
                      <input
                        type="checkbox"
                        name="freeService"
                        checked={productForm.card.freeService}
                        onChange={handleProductChange}
                        className="w-5 h-5 text-blue-500 rounded"
                      />
                      <span className="text-sm font-semibold text-blue-300">
                        Бесплатное обслуживание
                      </span>
                    </label>
                  </div>
                </section>
              )}

              {productForm.category === "CREDIT" && (
                <section className="bg-emerald-900/30 rounded-2xl p-6 border-2 border-emerald-500/30 space-y-4">
                  <h3 className="text-xl font-bold text-emerald-300">
                    💰 Параметры кредита
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      ["interestRateFrom", "Ставка от (%)", "8.5"],
                      ["interestRateTo", "Ставка до (%)", "15.5"],
                      ["minAmount", "Мин. сумма", "5000"],
                      ["maxAmount", "Макс. сумма", "100000"],
                      ["minTerm", "Мин. срок (мес.)", "12"],
                      ["maxTerm", "Макс. срок (мес.)", "60"],
                    ].map(([name, label, ph]) => (
                      <div key={name}>
                        <label className="block text-sm font-semibold text-emerald-300 mb-2">
                          {label}
                        </label>
                        <input
                          type="number"
                          name={name}
                          value={productForm.credit[name]}
                          onChange={handleProductChange}
                          placeholder={ph}
                          className="w-full bg-slate-900/50 border-2 border-emerald-600/50 focus:border-emerald-400 px-4 py-3 rounded-xl text-white placeholder-slate-500 transition"
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-emerald-300 mb-2">
                        Ссылка на сайт
                      </label>
                      <input
                        type="url"
                        name="websiteUrl"
                        value={productForm.credit.websiteUrl}
                        onChange={handleProductChange}
                        placeholder="https://bank.com/credit"
                        className="w-full bg-slate-900/50 border-2 border-emerald-600/50 px-4 py-3 rounded-xl text-white placeholder-slate-500 transition"
                      />
                    </div>
                  </div>
                </section>
              )}

              {productForm.category === "INSURANCE" && (
                <section className="bg-purple-900/30 rounded-2xl p-6 border-2 border-purple-500/30 space-y-4">
                  <h3 className="text-xl font-bold text-purple-300">
                    🛡️ Параметры страховки
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-purple-300 mb-2">
                        Короткое описание
                      </label>
                      <input
                        name="shortDescription"
                        value={productForm.insurance.shortDescription}
                        onChange={handleProductChange}
                        placeholder="Надежная защита..."
                        className="w-full bg-slate-900/50 border-2 border-purple-600/50 px-4 py-3 rounded-xl text-white placeholder-slate-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-purple-300 mb-2">
                        Базовая цена
                      </label>
                      <input
                        type="number"
                        name="basePrice"
                        value={productForm.insurance.basePrice}
                        onChange={handleProductChange}
                        placeholder="500"
                        className="w-full bg-slate-900/50 border-2 border-purple-600/50 px-4 py-3 rounded-xl text-white placeholder-slate-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-purple-300 mb-2">
                        Ссылка на сайт
                      </label>
                      <input
                        type="url"
                        name="websiteUrl"
                        value={productForm.insurance.websiteUrl}
                        onChange={handleProductChange}
                        placeholder="https://insurance.com/product"
                        className="w-full bg-slate-900/50 border-2 border-purple-600/50 px-4 py-3 rounded-xl text-white placeholder-slate-500 transition"
                      />
                    </div>
                  </div>
                </section>
              )}
            </div>
            <div className="sticky bottom-0 bg-gradient-to-r from-slate-800 to-blue-900 border-t-2 border-amber-500/30 px-8 py-6 rounded-b-3xl backdrop-blur-xl">
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-4">
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="w-full sm:w-auto px-8 py-3 border-2 border-slate-600 rounded-xl hover:bg-slate-700/50 transition font-semibold text-slate-300 hover:text-white"
                >
                  Отмена
                </button>
                <button
                  onClick={handleCreateProduct}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl transition shadow-xl font-bold"
                >
                  Создать продукт
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
