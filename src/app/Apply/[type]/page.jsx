"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumbs from "../../../Components/Breadcrumbs";

const CREDIT_CATEGORIES = [
  {
    subtype: "Consumer-loan",
    label: "Потребительский кредит",
    description: "Краткосрочные кредиты на любые нужды.",
    applyUrl: "/Apply/Consumer-loan",
  },
  {
    subtype: "Auto-loan",
    label: "Автокредит",
    description: "Кредиты для покупки автомобиля с удобными условиями.",
    applyUrl: "/Apply/Auto-loan",
  },
  {
    subtype: "Mortgage",
    label: "Ипотека",
    description: "Долгосрочные кредиты на покупку жилья.",
    applyUrl: "/Apply/Mortgage",
  },
  {
    subtype: "Secured-loan",
    label: "Кредит под залог",
    description: "Кредиты под залог недвижимости или имущества.",
    applyUrl: "/Apply/Secured-loan",
  },
];

export default function ApplyPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const creditType = CREDIT_CATEGORIES.find(
    (c) => c.subtype.toLowerCase() === params.type.toLowerCase()
  );

  const [formData, setFormData] = useState({
    type: creditType?.subtype || "",
    amount: "",
    rate: "",
    term: "",
    date: "",
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      amount: searchParams.get("amount") || "",
      rate: searchParams.get("rate") || "",
      term: searchParams.get("term") || "",
      date: searchParams.get("date") || "",
    }));
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applyCredit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Ошибка отправки заявки");
      alert("Заявка успешно отправлена!");
      setFormData((prev) => ({ ...prev, name: "", phone: "", email: "" }));
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка при отправке заявки");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Название кредита */}
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
        {creditType?.label || "Кредит"}
      </h1>
      <div className="">
        {/* Хлебные крошки */}
        <Breadcrumbs
          items={[{ label: "Главная", href: "/" }, { label: "Кредиты", href: "/Credits" }, { label: "Оформление" }]}
        />
      </div>
      {/* Карточки всех кредитов */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {CREDIT_CATEGORIES.map((c) => (
          <Link
            key={c.subtype}
            href={c.applyUrl}
            className={`block p-6 rounded-xl shadow-lg transition transform hover:scale-105 ${
              c.subtype === creditType?.subtype
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-blue-100"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">{c.label}</h2>
            <p className="text-sm">{c.description}</p>
          </Link>
        ))}
      </div>

      {/* Форма заявки */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Тип кредита</label>
          <input
            type="text"
            name="type"
            value={creditType?.label || ""}
            readOnly
            className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label>Сумма кредита</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label>Процентная ставка</label>
          <input
            type="number"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label>Срок кредита (мес.)</label>
          <input
            type="number"
            name="term"
            value={formData.term}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label>Дата выдачи</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label>Ваше имя</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label>Телефон</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          Отправить заявку
        </button>
      </form>
    </div>
  );
}
