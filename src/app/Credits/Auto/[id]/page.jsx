"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumbs from "../../../../Components/Breadcrumbs";
import useProductView from "../../../../hooks/useProductView";
import useProductClick from "../../../../hooks/useProductClick";

const CREDIT_SUBTYPE_MAP = {
  CONSUMER_LOAN: "Потребительский кредит",
  AUTO_LOAN: "Автокредит",
  MORTGAGE: "Ипотека",
  SECURED_LOAN: "Кредит под залог",
};

export default function AutoLoanDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Учёт просмотров
  useProductView(id);

  // ✅ Хук для кликов
  const sendClick = useProductClick(id);

  useEffect(() => {
    const loadCredit = async () => {
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

    loadCredit();
  }, [id]);

  if (loading) return <p className="text-white text-center mt-20">Загрузка...</p>;
  if (!credit) return <p className="text-white text-center mt-20">Кредит не найден</p>;

  const { title, description, credit: creditData, subtype } = credit;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d1c] to-[#0b1f3a] px-4 py-10">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Кредиты", href: "/Credits" },
          { label: "Автокредиты", href: "/Credits/Auto" },
          { label: title },
        ]}
      />

      <div className="max-w-4xl mx-auto bg-[#08162c] p-6 rounded-xl shadow-lg text-white">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-sm text-slate-400 mb-4">{CREDIT_SUBTYPE_MAP[subtype]}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <p>💰 <strong>Сумма:</strong> {creditData.minAmount} - {creditData.maxAmount} ₼</p>
            <p>📅 <strong>Срок:</strong> {creditData.minTerm} - {creditData.maxTerm} мес</p>
            <p>📈 <strong>Ставка:</strong> {creditData.interestRateFrom}% - {creditData.interestRateTo}%</p>
          </div>
          <div className="space-y-1">
            {creditData.initialPayment && <p>📝 <strong>Первоначальный взнос:</strong> {creditData.initialPayment} ₼</p>}
            {creditData.collateralRequired && <p>🏦 <strong>Требуется залог</strong></p>}
            {creditData.websiteUrl && (
              <p>
                🔗 <a 
                      href={creditData.websiteUrl} 
                      target="_blank" 
                      onClick={sendClick} 
                      className="text-blue-400 underline"
                    >
                  Перейти на сайт
                </a>
              </p>
            )}
          </div>
        </div>

        {description && <p className="text-slate-300 mb-6">{description}</p>}

        <div className="flex flex-wrap gap-4">
          {creditData.websiteUrl && (
            <a
              href={creditData.websiteUrl}
              target="_blank"
              onClick={sendClick}
              className="bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded-lg text-white"
            >
              Подать заявку
            </a>
          )}
          <button
            onClick={() => router.back()}
            className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg text-white"
          >
            Назад к списку
          </button>
        </div>
      </div>
    </div>
  );
}