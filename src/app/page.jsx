"use client";

import { useState, useEffect } from "react";
import { GrMoney } from "react-icons/gr";
import { CiCreditCard1, CiBank } from "react-icons/ci";
import Link from "next/link";
import { FaCar, FaCalculator, FaShieldAlt, FaCoins } from "react-icons/fa";

export default function Home() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка банков с сервера
  useEffect(() => {
    let mounted = true;

    const fetchBanks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dealers`);
        if (!res.ok) throw new Error("Ошибка API");

        const data = await res.json();
        const onlyBanks = Array.isArray(data)
          ? data.filter((d) => d.type === "BANK")
          : [];

        if (mounted) setBanks(onlyBanks);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Сервер банков недоступен");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBanks();

    return () => {
      mounted = false;
    };
  }, []);

  const products = [
    {
      icon: <GrMoney />,
      title: "Кредиты",
      desc: "Лучшие условия от банков",
      color: "bg-blue-500/10 text-blue-400",
      link: "/Apply/Credits",
    },
    {
      icon: <FaShieldAlt />,
      title: "Страхование",
      desc: "Авто, жизнь, имущество",
      color: "bg-indigo-500/10 text-indigo-400",
      link: "/Insurance",
    },
    {
      icon: <FaCoins />,
      title: "Вклады",
      desc: "Высокие проценты",
      color: "bg-cyan-500/10 text-cyan-400",
      link: "/Deposits",
    },
    {
      icon: <CiCreditCard1 />,
      title: "Карты",
      desc: "Дебет и кредит",
      color: "bg-purple-500/10 text-purple-400",
      link: "/Cards",
    },
    {
      icon: <FaCar />,
      title: "Ипотека",
      desc: "Жильё в рассрочку",
      color: "bg-orange-500/10 text-orange-400",
      link: "/Credits/Mortgage",
    },
    {
      icon: <FaCalculator />,
      title: "Калькулятор",
      desc: "Рассчёт платежей",
      color: "bg-green-500/10 text-green-400",
      link: "/Calculator",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050f2e] via-[#071b44] to-[#050f2e] text-slate-100">
      {/* HERO */}
      {/* <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 px-6 py-12"> */}
      <div className="bg-gradient-to-r from-[#0b2a6f] to-[#081c45] px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Финансовые продукты
            <span className="block text-blue-300 mt-2">
              нового уровня в Азербайджане
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl">
            Кредиты, карты, вклады, ипотека и страхование — всё в одном месте.
          </p>
        </div>
      </div>

      <div className="py-14 mx-6">
        {/* Ошибка / загрузка */}
        {loading && <p className="text-slate-400 mb-6">Загрузка банков...</p>}
        {error && <p className="text-red-400 mb-6">{error}</p>}

        {/* GRID - адаптивный под разные экраны */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {/* БОЛЬШОЙ БЛОК БАНКОВ */}
          <Link
            href="/Banks"
            className="relative overflow-hidden col-span-2 lg:col-span-1 lg:row-span-3 bg-gradient-to-br from-[#0b2a6f]/70 to-[#081c45]/80 border border-blue-500/20 rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(0,80,255,0.4)] transition hover:shadow-[0_30px_80px_-15px_rgba(0,120,255,0.6)] flex flex-col justify-between group"
          > 
            {/* Декоративные полосы */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute -top-10 -left-10 w-[150%] h-24 rotate-[-10deg] bg-white/10 blur-sm"></div>
              <div className="absolute top-1/3 -right-10 w-[150%] h-20 rotate-[8deg] bg-blue-400/10 blur-sm"></div>
              <div className="absolute bottom-10 -left-10 w-[150%] h-16 rotate-[-6deg] bg-indigo-400/10 blur-sm"></div>
            </div>

            {/* Контент */}
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 group-hover:text-blue-300 transition">
                Банки Азербайджана
              </h2>

              <p className="text-slate-300 mb-6 leading-relaxed">
                Все ведущие банки страны — кредиты, карты, ипотека, вклады и
                страхование в одном удобном сервисе для быстрого и выгодного
                выбора.
              </p>

              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Только лицензированные банки
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                  Актуальные процентные ставки
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  Удобное сравнение продуктов
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  Прямой переход на сайты банков
                </li>
              </ul>
            </div>

            {/* Подсказка при наведении */}
            <div className="relative z-10 mt-6 text-sm text-blue-300 font-semibold opacity-0 group-hover:opacity-100 transition">
              Открыть список банков →
            </div>
          </Link>

          {/* Продукты в 2 колонки */}
          {products.map((item, i) => (
            <Link
              key={i}
              href={item.link}
              className="group bg-[#081c45]/60 backdrop-blur border border-blue-500/20 rounded-3xl p-6 shadow-lg hover:shadow-[0_30px_80px_-15px_rgba(0,120,255,0.6)] transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${item.color}`}
                >
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-300 transition">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
              <span className="mt-4 text-sm text-blue-400 font-medium group-hover:underline">
                Открыть →
              </span>
            </Link>
          ))}
        </div>

        {/* SCROLLER БАНКОВ */}
        <div className="overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-white">Partnerlar</h2>
            <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium">
              {banks.length} bank
            </span>
          </div>
          <div className="relative">
            <div className="flex gap-4 pb-4 animate-scroll">
              {/* Первый набор банков */}
              {banks.map((bank) => (
                <Link
                  href={`/Banks/${bank.slug}`}
                  key={bank._id}
                  className="flex-shrink-0 w-[160px] h-[180px] bg-[#081c45]/70 border border-blue-500/20 rounded-2xl p-5 hover:bg-[#0a2555] transition flex flex-col items-center justify-center gap-3"
                >
                  <img
                    src={bank.logo?.url || "https://res.cloudinary.com/dvm6my9na/image/upload/v1772191128/7fdea15f07cfdf7ce64d3bb5813ccf_znahgc.webp"}
                    alt={bank.name}
                    className="h-20 w-20 object-contain "
                  />
                  <span className="text-sm text-center font-medium line-clamp-2">
                    {bank.name}
                  </span>
                </Link>
              ))}
              {/* Дублируем для бесконечного скролла */}
              {banks.map((bank) => (
                <Link
                  href={`/Banks/${bank.slug}`}
                  key={`${bank._id}-duplicate`}
                  className="flex-shrink-0 w-[160px] h-[180px] bg-slate-800/70 rounded-2xl p-5 hover:bg-slate-700 transition flex flex-col items-center justify-center gap-3"
                >
                  <img
                    src={bank.logo?.url || "/https://res.cloudinary.com/dvm6my9na/image/upload/v1772191128/7fdea15f07cfdf7ce64d3bb5813ccf_znahgc.webp"}
                    alt={bank.name}
                    className="h-20 w-20 object-contain"
                  />
                  <span className="text-sm text-center font-medium line-clamp-2">
                    {bank.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Добавь эти стили в конец компонента */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            scrollbar-width: none;
          }

          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-scroll {
            animation: scroll 20s linear infinite;
          }

          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </div>
  );
}
