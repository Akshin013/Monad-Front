"use client";
import { useState } from "react";

export default function CreditApplicationForm({ credit }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: credit._id,
          ...form,
        }),
      });
      const data = await res.json();
      alert(data.message || "Заявка отправлена ✅");
    } catch (err) {
      console.error(err);
      alert("Ошибка при отправке заявки");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <p className="text-slate-400">{credit.title}</p>

      <input
        placeholder="ФИО"
        className="w-full p-3 rounded bg-[#0b1f3a] text-white"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        placeholder="Телефон"
        className="w-full p-3 rounded bg-[#0b1f3a] text-white"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        required
      />
      <input
        placeholder="Email"
        className="w-full p-3 rounded bg-[#0b1f3a] text-white"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        type="email"
        required
      />

      <button className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-semibold">
        Отправить заявку
      </button>
    </form>
  );
}
