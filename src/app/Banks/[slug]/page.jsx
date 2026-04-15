"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaGlobe,
  FaUniversity,
  FaCheckCircle,
} from "react-icons/fa";
import Breadcrumbs from "../../../Components/Breadcrumbs";

const CATEGORY_CARDS = [
  {
    title: "Карты",
    value: "CARD",
    desc: "Все дебетовые и кредитные карты банка",
    icon: "💳",
    color: "bg-blue-600/30",
  },
  {
    title: "Кредиты",
    value: "CREDIT",
    desc: "Потребительские и автокредиты",
    icon: "💰",
    color: "bg-green-600/30",
  },
  {
    title: "Ипотека",
    value: "MORTGAGE",
    desc: "Ипотечные кредиты и рефинансирование",
    icon: "🏠",
    color: "bg-purple-600/30",
  },
  {
    title: "Вклады",
    value: "DEPOSIT",
    desc: "Сберегательные и депозитные продукты",
    icon: "🏦",
    color: "bg-yellow-600/30",
  },
];

export default function BankDetailPage() {
  const { slug } = useParams();
  const [bank, setBank] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ABOUT");
  const [loading, setLoading] = useState(true);
  const [logoData, setlogoData] = useState(null);
  const fallbackLogo =
    "https://res.cloudinary.com/dvm6my9na/image/upload/v1772191128/7fdea15f07cfdf7ce64d3bb5813ccf_znahgc.webp";

  useEffect(() => {
    fetchBank();
  }, [slug]);

  useEffect(() => {
    if (bank && activeFilter !== "ABOUT") {
      fetchProducts(activeFilter);
    } else {
      setProducts([]);
    }
  }, [activeFilter, bank]);

  useEffect(() => {
    if (!bank?._id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dealers/${bank._id}/view`, {
      method: "POST",
    }).catch((err) => console.error("View error:", err));
  }, [bank?._id]);

  const fetchBank = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dealers/${slug}`,
      );
      const data = await res.json();

      if (!res.ok) {
        console.warn("fetchBank error", res.status, data);
        setBank(null);
        return;
      }

      setlogoData(data.logo?.url || null);
      setBank(data);
    } catch (err) {
      console.error("fetchBank exception:", err);
      setBank(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (category) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?dealer=${bank._id}&category=${category}`,
      );
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Загрузка банка...
      </div>
    );
  }

  if (!bank) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-300">
        Банк не найден
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-5 py-3">
          <Breadcrumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Банки", href: "/Banks" },
              { label: bank.name },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 px-4">
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/25 bg-gradient-to-r from-slate-900 via-blue-950/80 to-slate-900 p-7 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />

          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
            <div className="flex h-36 w-36 items-center justify-center rounded-3xl border border-white/20 bg-white/10 backdrop-blur md:h-40 md:w-40">
              {bank.logo || logoData ? (
                <img
                  src={logoData || bank.logo || fallbackLogo}
                  alt={bank.name}
                  className="h-24 w-24 object-contain"
                />
              ) : (
                <FaUniversity className="text-6xl text-white/80" />
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-extrabold">{bank.name}</h1>
                {bank.isPremium && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    <FaCheckCircle size={16} /> Premium
                  </span>
                )}
              </div>

              {bank.license && (
                <p className="text-sm text-slate-300">Лицензия № {bank.license}</p>
              )}

              <div className="flex flex-wrap gap-6 text-sm text-slate-200">
                {bank.address && (
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-300" />
                    <span className="line-clamp-1">{bank.address}</span>
                  </div>
                )}
                {bank.contacts?.phone && (
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-blue-300" />
                    {bank.contacts.phone}
                  </div>
                )}
                {(bank.workingDays || bank.workingHours) && (
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-300" />
                    {bank.workingDays || "Пн–Пт"}{" "}
                    {bank.workingHours || "09:00 – 18:00"}
                  </div>
                )}
              </div>
            </div>

            {bank.websiteUrl && (
              <a
                href={bank.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
                onClick={() => {
                  fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/dealers/${bank._id}/external-click`,
                    {
                      method: "POST",
                    },
                  );
                }}
              >
                <FaGlobe />
                Перейти на сайт
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>
            )}
          </div>
        </div>
      </div>

      {Array.isArray(bank.covers) && bank.covers.length > 0 && (
        <div className="max-w-7xl mx-auto mt-8 px-4">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {bank.covers.map((url, idx) => (
              <div
                key={idx}
                className="min-w-[280px] h-40 rounded-2xl border border-slate-800 bg-slate-900 flex items-center justify-center overflow-hidden"
              >
                <img
                  src={url}
                  alt={`${bank.name} баннер ${idx + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 mb-10 mt-8">
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveFilter("ABOUT")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeFilter === "ABOUT"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            О банке
          </button>
          <ul className="flex flex-wrap justify-center gap-3">
            {CATEGORY_CARDS.map((type) => (
              <li
                key={type.value}
                onClick={() => setActiveFilter(type.value)}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeFilter === type.value
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {type.title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {activeFilter === "ABOUT" && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 md:p-10">
            <h2 className="mb-4 text-2xl font-bold text-white">О банке</h2>
            <p className="max-w-3xl leading-relaxed text-slate-300">
              {bank.description ||
                "Описание банка пока не добавлено. Здесь будет подробная информация о преимуществах, услугах и условиях обслуживания для физических и корпоративных клиентов."}
            </p>
          </div>
        )}

        {activeFilter !== "ABOUT" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length === 0 && (
              <div className="col-span-full rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center text-slate-400">
                Продукты в этой категории пока не добавлены
              </div>
            )}

            {products.map((p) => (
              <Link
                key={p._id}
                href={`/Products/${p._id}`}
                className="group flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-7 transition-all hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_25px_70px_-30px_rgba(37,99,235,0.65)]"
              >
                <div>
                  <span className="mb-3 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
                    {activeFilter}
                  </span>

                  <h3 className="mb-3 text-xl font-extrabold text-white transition group-hover:text-blue-300">
                    {p.title}
                  </h3>

                  <p className="line-clamp-3 text-sm text-slate-400">
                    {p.description ||
                      "Подробное описание продукта доступно на странице просмотра."}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Валюта: {p.currency || "—"}
                  </span>
                  <span className="font-bold text-blue-300 group-hover:underline">
                    Подробнее →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
