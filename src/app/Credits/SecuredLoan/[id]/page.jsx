"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "../../../../Components/Breadcrumbs";
import useProductView from "../../../../hooks/useProductView";
import useProductClick from "../../../../hooks/useProductClick";

export default function SecuredLoanDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Учет просмотров страницы
  useProductView(id);

  // ✅ Хук для кликов по кнопке "Подать заявку"
  const sendClick = useProductClick(id);

  useEffect(() => {
    const fetchCredit = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        const data = await res.json();
        setCredit(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCredit();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center mt-20 text-white">Загрузка кредита...</p>
    );
  }

  if (!credit) {
    return (
      <p className="text-center mt-20 text-red-400">Кредит не найден</p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d1c] to-[#0b1f3a] px-4 py-10">
      <div className="max-w-6xl mx-auto mb-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Кредиты", href: "/Credits" },
            { label: "Под залог", href: "/Credits/SecuredLoan" },
            { label: credit.title },
          ]}
        />
      </div>

      <div className="max-w-5xl mx-auto bg-[#08162c] rounded-2xl p-8 shadow-xl">
        <p className="text-blue-400 mb-2">Кредит под залог</p>

        <h1 className="text-3xl font-bold text-white mb-4">{credit.title}</h1>

        <p className="text-slate-300 mb-8">{credit.description}</p>

        {credit.credit && (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Info label="Сумма кредита">
              {credit.credit.minAmount} – {credit.credit.maxAmount} ₼
            </Info>

            <Info label="Срок">
              {credit.credit.minTerm} – {credit.credit.maxTerm} мес
            </Info>

            <Info label="Процентная ставка">
              {credit.credit.interestRateFrom}% – {credit.credit.interestRateTo}%
            </Info>

            <Info label="Тип залога">
              {credit.credit.collateralType || "Недвижимость / авто"}
            </Info>

            <Info label="Валюта">{credit.currency}</Info>

            <Info label="Комиссия">{credit.credit.fees ?? "Без комиссии"}</Info>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          {credit.credit?.websiteUrl && (
            <a
              href={credit.credit.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={sendClick} // ✅ учет перехода
              className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl text-center font-semibold transition"
            >
              Подать заявку
            </a>
          )}

          <button
            onClick={() => router.push("/Credits/SecuredLoan")}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl text-center transition"
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, children }) {
  return (
    <div className="bg-[#0b1f3a] rounded-xl p-4">
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-white font-semibold">{children}</p>
    </div>
  );
}