"use client";

import { useState } from "react";

export default function CalculatorModal({ onClose }) {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const calculateCredit = () => {
    if (!amount || !rate || !term) return;
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(term);
    const P = parseFloat(amount);
    const payment = (P * r) / (1 - Math.pow(1 + r, -n));
    setMonthlyPayment(payment.toFixed(2));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Кредитный калькулятор</h2>

        <input
          type="number"
          placeholder="Сумма кредита"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="number"
          placeholder="Процентная ставка (%)"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="number"
          placeholder="Срок (мес.)"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          onClick={calculateCredit}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition mb-2"
        >
          Рассчитать
        </button>

        {monthlyPayment && (
          <p className="text-center font-bold mt-2">
            Ежемесячный платеж: {monthlyPayment} ₽
          </p>
        )}
      </div>
    </div>
  );
}
