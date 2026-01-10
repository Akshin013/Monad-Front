"use client";
import Link from "next/link";
import Breadcrumbs from "@/Components/Breadcrumbs";

const CREDIT_CATEGORIES = [
  {
    subtype: "Consumer",
    label: "Потребительский кредит",
    description: "Краткосрочные кредиты на любые нужды.",
    applyUrl: "/apply/consumer-loan", // можно заменить на реальный
  },
  {
    subtype: "Auto",
    label: "Автокредит",
    description: "Кредиты для покупки автомобиля с удобными условиями.",
    applyUrl: "/apply/auto-loan",
  },
  {
    subtype: "Mortgage",
    label: "Ипотека",
    description: "Долгосрочные кредиты на покупку жилья.",
    applyUrl: "/apply/mortgage",
  },
  {
    subtype: "SecuredLoan",
    label: "Кредит под залог",
    description: "Кредиты под залог недвижимости или имущества.",
    applyUrl: "/apply/secured-loan",
  },
];

export default function CreditsCategoryGrid() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d1c] to-[#0b1f3a] py-10 px-4">
      <div className=" bg-[#050d1c] px-4 ">
        {/* Хлебные крошки */}
        <Breadcrumbs
          items={[{ label: "Главная", href: "/" }, { label: "Кредиты" }]}
        />
      </div>

      <h1 className="text-3xl font-bold text-white text-center mb-10">
        Кредиты
      </h1>

      <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-2">
        {CREDIT_CATEGORIES.map((cat) => (
          <div
            key={cat.subtype}
            className="bg-[#08162c] rounded-2xl p-6 shadow flex flex-col justify-between hover:shadow-lg transition"
          >
            <div>
              <p className="text-sm text-blue-400 mb-2">{cat.label}</p>
              <p className="text-slate-300 mb-4">{cat.description}</p>
            </div>

            <div className="flex gap-4 mt-4">
              <a
                href={cat.applyUrl}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded text-center transition"
              >
                Подать заявку
              </a>
              <Link
                href={`/Credits/${cat.subtype}`}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded text-center transition"
              >
                Подробнее
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
