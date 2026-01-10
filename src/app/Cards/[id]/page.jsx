"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumbs from "@/Components/Breadcrumbs";

const subtypeMap = {
  DEBIT_CARD: "Дебетовая карта",
  CREDIT_CARD: "Кредитная карта",
};

export default function CardDetails() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCard = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setCard(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050d1c] flex items-center justify-center text-white">
        Загрузка...
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-[#050d1c] flex items-center justify-center text-white">
        Карта не найдена
      </div>
    );
  }

  const isCredit = card.subtype === "CREDIT_CARD";
  const isDebit = card.subtype === "DEBIT_CARD";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d1c] to-[#0b1f3a] px-4 py-10">
      <div className=" bg-[#050d1c] px-4 ">
        {/* Хлебные крошки */}
        <Breadcrumbs
          items={[{ label: "Главная", href: "/" }, { label: "Карты", href: "/Cards" }, { label: "Карта" }]}
        />
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

        {/* 🪪 Визуал карты */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm h-56 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 shadow-2xl p-6 text-white flex flex-col justify-between">
            <div className="flex justify-between text-sm opacity-80">
              <span>{card.card?.cardNetwork || "VISA"}</span>
              <span>{subtypeMap[card.subtype]}</span>
            </div>

            <div className="tracking-widest text-lg">
              •••• •••• •••• 4829
            </div>

            <div className="flex justify-between text-sm">
              <span>{card.title}</span>
              <span>12/28</span>
            </div>
          </div>
        </div>

        {/* 📄 Информация */}
        <div className="bg-[#08162c] rounded-2xl p-6 shadow-xl text-white flex flex-col justify-between">

          <div>
            <h1 className="text-2xl font-bold">{card.title}</h1>
            <p className="text-slate-400 text-sm mt-1">
              {subtypeMap[card.subtype]}
            </p>

            {/* ===================== */}
            {/* 💳 КРЕДИТНАЯ КАРТА */}
            {/* ===================== */}
            {isCredit && (
              <div className="grid grid-cols-2 gap-6 mt-6">
                <Info label="Кредитный лимит">
                  до {card.card?.creditLimit || 0} ₼
                </Info>

                <Info label="Льготный период">
                  {card.card?.gracePeriod || 0} дней
                </Info>

                <Info label="Процентная ставка">
                  {card.card?.interestRate || 0} %
                </Info>

                <Info label="Годовое обслуживание">
                  {card.card?.annualFee || 0} ₼
                </Info>
              </div>
            )}

            {/* ===================== */}
            {/* 💳 ДЕБЕТОВАЯ КАРТА */}
            {/* ===================== */}
            {isDebit && (
              <div className="grid grid-cols-2 gap-6 mt-6">
                <Info label="Обслуживание">
                  {card.card?.freeService ? "Бесплатно" : "Платно"}
                </Info>

                <Info label="Cashback">
                  {card.card?.cashback || 0} %
                </Info>

                <Info label="Срок действия">
                  {card.card?.term || "—"} лет
                </Info>

                <Info label="Валюта">
                  {card.currency}
                </Info>
              </div>
            )}
          </div>

          {/* 🔘 Кнопки */}
          <div className="mt-8 gap-3 flex">
            <button className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-sm font-semibold transition">
              {isCredit ? "Оформить кредит" : "Заказать карту"}
            </button>

            <a
              href={card.websiteUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-slate-600 hover:border-slate-400 py-3 rounded-xl text-sm font-semibold text-center transition"
            >
              Подробнее
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Вспомогательный блок */
function Info({ label, children }) {
  return (
    <div>
      <div className="text-lg font-semibold">{children}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}
