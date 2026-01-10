"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumbs from "@/Components/Breadcrumbs";

const subtypeMap = {
  DEBIT_CARD: "Дебетовая карта",
  CREDIT_CARD: "Кредитная карта",
};

const Cards = () => {
  const [cards, setCards] = useState([]);
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "ALL"; // читаем tab из URL
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products?category=CARD"
        );
        const data = await res.json();
        setCards(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCards();
  }, []);

  const filteredCards = cards.filter((card) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "DEBIT") return card.subtype === "DEBIT_CARD";
    if (activeTab === "CREDIT") return card.subtype === "CREDIT_CARD";
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d1c] to-[#0b1f3a] px-4 py-10">
      <div className=" bg-[#050d1c] px-4 ">
        {/* Хлебные крошки */}
        <Breadcrumbs
          items={[{ label: "Главная", href: "/" }, { label: "Карты" }]}
        />
      </div>

      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        Банковские карты
      </h1>

      {/* TABS */}
      <ul className="flex gap-6 justify-center mb-10 border-b border-slate-700">
        {[
          { key: "ALL", label: "Все карты" },
          { key: "DEBIT", label: "Дебетовые" },
          { key: "CREDIT", label: "Кредитные" },
        ].map((tab) => (
          <li
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              cursor-pointer
              pb-3
              text-sm
              font-medium
              transition
              ${
                activeTab === tab.key
                  ? "text-white border-b-2 border-blue-500"
                  : "text-slate-400 hover:text-white"
              }
            `}
          >
            {tab.label}
          </li>
        ))}
      </ul>

      {/* CARDS */}
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {filteredCards.map((card) => (
          <div
            key={card._id}
            className="
              bg-[#08162c]
              rounded-2xl
              shadow-xl
              p-5
              flex
              gap-4
              hover:scale-[1.02]
              transition
            "
          >
            {/* Левая часть — карта */}
            <div className="w-32 flex-shrink-0 flex items-center">
              <div className="w-full h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-lg flex items-end p-2">
                <span className="text-xs text-white font-semibold">
                  {card.card?.cardNetwork || "VISA"}
                </span>
              </div>
            </div>

            {/* Правая часть */}
            <div className="flex flex-col justify-between text-white w-full">
              <div>
                <p className="text-sm text-slate-400">
                  {subtypeMap[card.subtype]}
                </p>
                <h2 className="text-lg font-semibold">{card.title}</h2>
              </div>

              <div className="mt-3 space-y-1 text-sm text-slate-300">
                {card.subtype === "CREDIT_CARD" && (
                  <>
                    <p>
                      💳 Лимит:{" "}
                      <span className="text-white">
                        до {card.card?.creditLimit || 0} ₼
                      </span>
                    </p>
                    <p>
                      🎁 Кешбек:{" "}
                      <span className="text-white">
                        {card.card?.cashbackPercent || 0}%
                      </span>
                    </p>
                  </>
                )}

                <p>
                  📅 Обслуживание:{" "}
                  <span className="text-white">
                    {card.card?.freeService
                      ? "Бесплатно"
                      : `${card.card?.annualFee || 0} ₼ / год`}
                  </span>
                </p>
              </div>

              <Link href={`/Cards/${card._id}`}>
                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg">
                  Подробнее
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
