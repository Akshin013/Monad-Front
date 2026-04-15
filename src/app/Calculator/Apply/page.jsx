"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Breadcrumbs from "../../../Components/Breadcrumbs";


// Словарь для красивых названий типов кредитов
const TYPE_NAMES = {
  CONSUMER_LOAN: "Потребительский кредит",
  AUTO_LOAN: "Автокредит",
  MORTGAGE: "Ипотека",
  SECURED_LOAN: "Кредит под залог",
};

export default function ApplyPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    rate: "",
    term: "",
    date: "",
    name: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Обновляем данные из URL при загрузке
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      type: searchParams.get("type") || "",
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
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applyCard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Заявка успешно отправлена!");
        setFormData({
          type: formData.type, // оставляем выбранный тип
          amount: "",
          rate: "",
          term: "",
          date: "",
          name: "",
          phone: "",
          email: "",
        });
      } else {
        setMessage(data.error || "Ошибка при отправке заявки");
      }
    } catch (err) {
      console.error(err);
      setMessage("Ошибка сети или сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-[#0b1f3a] px-4 py-10">
      <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Оформление кредита</h1>
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-3 mb-4">
        {/* Хлебные крошки */}
        <Breadcrumbs
          items={[{ label: "Главная", href: "/" }, { label: "Калькулятор", href: "/Calculator" }, { label: "Оформление" }]}
        />
      </div>
      {message && (
        <div className="mb-4 p-3 rounded bg-green-500/20 border border-green-500/30 text-green-300">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
        <div>
          <label className="block font-medium mb-1">Тип кредита</label>
          <div className="px-3 py-2 border border-slate-700 bg-slate-950 rounded font-semibold text-slate-100">
            {TYPE_NAMES[formData.type] || "Не выбран"}
          </div>
        </div>

        <div>
          <label>Сумма кредита</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
          />
        </div>

        <div>
          <label>Процентная ставка</label>
          <input
            type="number"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
          />
        </div>

        <div>
          <label>Срок кредита (мес.)</label>
          <input
            type="number"
            name="term"
            value={formData.term}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
          />
        </div>

        <div>
          <label>Дата выдачи</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
          />
        </div>

        <div>
          <label>Ваше имя</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
          />
        </div>

        <div>
          <label>Телефон</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition disabled:opacity-50"
        >
          {loading ? "Отправка..." : "Отправить заявку"}
        </button>
      </form>
      </div>
    </div>
  );
}
