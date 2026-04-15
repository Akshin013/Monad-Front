"use client";
import { useState } from "react";
import Link from "next/link";
// import Breadcrumbs from "../Components/Breadcrumbs";
import Breadcrumbs from "../../Components/Breadcrumbs";

export default function CreditCalculator() {
  const [amount, setAmount] = useState(100000); // сумма кредита
  const [term, setTerm] = useState(12); // срок в месяцах
  const [rate, setRate] = useState(12); // процентная ставка годовая
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // дата выдачи
  const [type, setType] = useState("CONSUMER_LOAN"); // тип кредита

  const [result, setResult] = useState(null);

  const calculate = () => {
    // Переводим годовую ставку в месячную
    const monthlyRate = rate / 100 / 12;
    // Ежемесячный платеж по аннуитетной формуле
    const monthlyPayment =
      (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
    const totalPayment = monthlyPayment * term;
    const interestPaid = totalPayment - amount;
    const overpayment = (interestPaid / amount) * 100;
    const fullCost = rate; // для простоты годовая ставка

    setResult({
      monthlyPayment,
      totalPayment,
      interestPaid,
      overpayment,
      fullCost,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-[#0b1f3a] px-4 py-10">
      <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Кредитный калькулятор</h1>
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-3 mb-6">
        {/* Хлебные крошки */}
        <Breadcrumbs
          items={[{ label: "Главная", href: "/" }, { label: "Калькулятор" }]}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
        <div>
          <label className="block text-sm font-medium mb-1">
            Сумма кредита
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Срок (месяцы)
          </label>
          <input
            type="number"
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Процентная ставка, %
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Дата выдачи</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Тип кредита</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-slate-950 text-slate-100 px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CONSUMER_LOAN">Потребительский</option>
            <option value="AUTO_LOAN">Автокредит</option>
            <option value="MORTGAGE">Ипотека</option>
            <option value="SECURED_LOAN">Под залог</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        className="bg-blue-600 hover:bg-blue-500 mb-4 text-white font-semibold px-6 py-3 rounded-lg transition"
      >
        Рассчитать
      </button>


      {result && (
        <div className="mt-8 mb-4 bg-slate-900/70 border border-slate-800 text-white p-6 rounded-lg shadow-lg space-y-3">
          <h2 className="text-xl font-bold mb-2">Результаты</h2>
          <p>
            Ежемесячный платеж:{" "}
            <span className="font-semibold">
              {result.monthlyPayment.toFixed(0)} ₽
            </span>
          </p>
          <p>
            Сумма всех платежей:{" "}
            <span className="font-semibold">
              {result.totalPayment.toFixed(0)} ₽
            </span>
          </p>
          <p>
            Начисленные проценты:{" "}
            <span className="font-semibold">
              {result.interestPaid.toFixed(0)} ₽
            </span>
          </p>
          <p>
            Переплата за весь период:{" "}
            <span className="font-semibold">
              {result.overpayment.toFixed(2)} %
            </span>
          </p>
          <p>
            Полная стоимость кредита за год:{" "}
            <span className="font-semibold">
              {result.fullCost.toFixed(2)} %
            </span>
          </p>
        </div>
        
      )}
      <Link className="mt" href={`/Calculator/Apply?type=${type}&amount=${amount}&rate=${rate}&term=${term}&date=${startDate}`}>
            <button
        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold w-full px-6 py-3 rounded-lg transition"
      >
        Оформить
      </button>
      </Link>
      </div>
    </div>
  );
}
