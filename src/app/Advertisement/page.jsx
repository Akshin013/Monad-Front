"use client";

import { useState } from "react";

export default function ReklamPage() {
  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ads-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    alert("Заявка успешно отправлена!");
    setForm({
      company: "",
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  } catch (err) {
    alert(err.message || "Ошибка отправки");
  }
};


  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold text-primary mb-3">Реклама</h1>
      <p className="text-gray-600 max-w-3xl mb-10">
        Мы даем компаниям возможность рекламировать свои услуги, и этим мы обеспечиваем развитие сервиса.
      </p>

      {/* Преимущества */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {[
          "Мы не смешиваем объективное сравнение и рекламные предложения.",
          "Вы всегда можете рассчитать рекламный продукт и понять, насколько он вам выгоден.",
          "Реклама интересна не только компаниям, но и самим посетителям.",
          "Финансовый рынок очень конкурентный, реклама — возможность рассказать о себе.",
        ].map((item, i) => (
          <div key={i} className="flex gap-4 bg-white p-5 rounded-xl border shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              ✓
            </div>
            <p className="text-gray-700">{item}</p>
          </div>
        ))}
      </div>

      {/* Кнопка PDF */}
      <div className="mb-14">
        <a
          href="/files/reklama-trebovaniya.pdf"
          download
          className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition shadow"
        >
          📄 Скачать технические требования (PDF)
        </a>
      </div>

      {/* Форма */}
      <div className="grid md:grid-cols-2 gap-10 items-start">

        <div>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            Подать заявку на рекламу
          </h2>
          <p className="text-gray-600 mb-6">
            Заполните форму и наши менеджеры свяжутся с вами в ближайшее время.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="company"
              placeholder="Название компании"
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              name="name"
              placeholder="Контактное лицо"
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Телефон"
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <textarea
              name="message"
              placeholder="Сообщение"
              rows="5"
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition"
            >
              Отправить заявку
            </button>

          </form>
        </div>

        {/* Контакты */}
        <div className="bg-gray-50 border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Контакты для сотрудничества</h3>
          <p className="text-gray-600 mb-2">📧 partners@yourdomain.az</p>
          <p className="text-gray-600 mb-2">📞 +994 12 000 00 00</p>
          <p className="text-gray-600">🕘 Пн–Пт 10:00 – 18:00</p>
        </div>

      </div>

    </div>
  );
}
