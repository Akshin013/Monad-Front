"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { FaCheckCircle } from "react-icons/fa";
import { FiMapPin, FiPhone, FiSearch, FiClock } from "react-icons/fi";

export default function BanksPage() {
  const [banks, setBanks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fallbackLogo =
    "https://res.cloudinary.com/dvm6my9na/image/upload/v1772191128/7fdea15f07cfdf7ce64d3bb5813ccf_znahgc.webp";

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dealers`);
        if (!res.ok) throw new Error("Ошибка загрузки банков");

        const data = await res.json();
        const onlyBanks = data.filter((dealer) => dealer.type === "BANK");

        setBanks(onlyBanks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  const filteredBanks = banks.filter((bank) =>
    bank.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center text-slate-300">
          Загрузка банков...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-slate-200">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Банки" },
          ]}
        />
      </div>

      <div className="mb-8 overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-slate-900 via-blue-950/80 to-slate-900 p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs uppercase tracking-wide text-blue-300">
              Каталог банков
            </p>
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              Банки Азербайджана
            </h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Сравнивайте банки, проверяйте контакты и режим работы, переходите
              к подробной странице в один клик.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
            <p className="text-xs text-slate-400">Всего банков</p>
            <p className="text-2xl font-bold text-blue-300">{banks.length}</p>
          </div>
        </div>
      </div>

      <div className="mb-7">
        <div className="mx-auto max-w-xl">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Поиск банка
          </label>
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Введите название банка..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 py-3 pl-11 pr-4 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
          </div>
        </div>
      </div>

      <div className="mb-4 hidden grid-cols-[140px_1.2fr_1.4fr_1fr] gap-4 rounded-xl border border-slate-800 bg-slate-900/70 px-6 py-4 text-sm font-semibold text-slate-300 md:grid">
        <div>Логотип</div>
        <div>Название</div>
        <div>Контакты</div>
        <div>Часы работы</div>
      </div>

      <div className="space-y-3">
        {filteredBanks.map((bank) => (
          <Link
            key={bank._id}
            href={`/Banks/${bank.slug}`}
            className="group grid grid-cols-1 items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-5 transition hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-[0_20px_60px_-30px_rgba(37,99,235,0.65)] md:grid-cols-[140px_1.2fr_1.4fr_1fr]"
          >
            <div className="flex justify-start md:justify-center items-center">
              <img
                src={bank.logo?.url || bank.logo || fallbackLogo}
                alt={bank.name}
                className="h-14 object-contain"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-lg font-semibold text-white">{bank.name}</div>
                {bank.isPremium && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    <FaCheckCircle size={12} />
                    Premium
                  </span>
                )}
              </div>
              {bank.license && (
                <div className="mt-1 text-sm text-slate-400">
                  Лицензия № {bank.license}
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-sm text-slate-300">
              {bank.contacts?.phone && (
                <div className="flex items-center gap-2">
                  <FiPhone className="text-blue-300" />
                  <span>{bank.contacts.phone}</span>
                </div>
              )}
              {bank.address && (
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-blue-300" />
                  <span className="line-clamp-1">{bank.address}</span>
                </div>
              )}
            </div>

            <div className="space-y-1 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <FiClock className="text-blue-300" />
                {bank.workingDays || "Пн–Пт"}:{" "}
                {bank.workingHours || "09:00 – 18:00"}
              </div>
              <div className="text-xs text-slate-500">
                Сб–Вс: выходной
              </div>
            </div>
          </Link>
        ))}

        {!filteredBanks.length && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 py-12 text-center text-slate-400">
            Ничего не найдено. Попробуйте изменить поисковый запрос.
          </div>
        )}
      </div>
    </div>
  );
}
