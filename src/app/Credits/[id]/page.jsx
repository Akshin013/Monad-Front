"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function CreditDetailPage() {
  const params = useParams();
  const [credit, setCredit] = useState(null);

  useEffect(() => {
    const fetchCredit = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`);
        const data = await res.json();
        setCredit(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCredit();
  }, [params.id]);

  if (!credit) return <p className="text-white text-center mt-20">Загрузка...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d1c] to-[#0b1f3a] px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">{credit.title}</h1>

      <div className="max-w-4xl mx-auto bg-[#08162c] rounded-2xl shadow-xl p-6 flex flex-col gap-4 text-white">
        {/* <p><strong>Тип кредита:</strong> {CREDIT_SUBTYPE_MAP[credit.subtype]}</p> */}
        <p><strong>Банк:</strong> {credit.provider?.name || "Банк"}</p>
        <p><strong>Сумма:</strong> {credit.credit?.minAmount} – {credit.credit?.maxAmount} ₼</p>
        <p><strong>Срок:</strong> {credit.credit?.minTerm} – {credit.credit?.maxTerm} мес</p>
        <p><strong>Ставка:</strong> от {credit.credit?.interestRateFrom}%</p>
        <p><strong>Под залог:</strong> {credit.credit?.collateralRequired ? "Да" : "Нет"}</p>

        {credit.description && (
          <div className="mt-4">
            <h2 className="font-semibold mb-2">Описание:</h2>
            <p>{credit.description}</p>
          </div>
        )}

        <a
          href={credit.link || "#"}
          target="_blank"
          className="mt-4 w-full inline-block text-center bg-blue-600 hover:bg-blue-500 py-2 rounded-lg"
        >
          Перейти на сайт банка
        </a>
      </div>
    </div>
  );
}
