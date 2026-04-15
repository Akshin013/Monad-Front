"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumbs from "../../../Components/Breadcrumbs";

export default function SecuredLoanPage() {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?subtype=SECURED_LOAN`
        );
        const data = await res.json();
        setCredits(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-20 text-white">
        Загрузка кредитов под залог...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d1c] to-[#0b1f3a] px-4 py-10">
      <div className="max-w-6xl mx-auto mb-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Кредиты", href: "/Credits" },
            { label: "Под залог" },
          ]}
        />
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Кредиты под залог
        </h1>

        {credits.length === 0 && (
          <p className="text-slate-400">
            Предложения временно отсутствуют
          </p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credits.map((credit) => (
            <div
              key={credit._id}
              className="bg-[#08162c] rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-white mb-2">
                {credit.title}
              </h2>

              <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                {credit.description}
              </p>

              {credit.credit && (
                <div className="text-sm text-slate-300 space-y-1 mb-5">
                  <p>
                    💰 Сумма: {credit.credit.minAmount} –{" "}
                    {credit.credit.maxAmount} ₼
                  </p>
                  <p>
                    📆 Срок: {credit.credit.minTerm} –{" "}
                    {credit.credit.maxTerm} мес
                  </p>
                  <p>
                    📉 Ставка от {credit.credit.interestRateFrom}%
                  </p>
                </div>
              )}

              <Link
                href={`/Credits/SecuredLoan/${credit._id}`}
                className="inline-block w-full text-center bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl transition"
              >
                Подробнее
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
