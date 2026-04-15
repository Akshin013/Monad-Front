"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BecomeDealer() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    type: "BANK", // BANK or MFI
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess("");

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      return setMessage("Заполните все поля");
    }

    if (formData.password !== formData.confirmPassword) {
      return setMessage("Пароли не совпадают");
    }

    if (formData.password.length < 6) {
      return setMessage("Пароль должен быть минимум 6 символов");
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dealer-requests/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            type: formData.type,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Ошибка отправки");
      }

      setSuccess(
        "✅ Заявка отправлена администратору. Ожидайте подтверждения.",
      );

      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Заявка дилера
        </h2>

        {message && (
          <p className="mb-4 text-center text-red-600 font-medium">{message}</p>
        )}

        {success && (
          <p className="mb-4 text-center text-green-600 font-medium">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Повторите пароль"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <div className="text-black">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Я представляю:
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white shadow-sm 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               focus:border-transparent transition"
            >
              <option value="">Выберите тип организации</option>
              <option value="BANK">Банк</option>
              <option value="MFI">МФО / БОКТ</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow hover:from-blue-600 hover:to-indigo-700 transition-all"
          >
            {loading ? "Отправка..." : "Отправить заявку"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Уже есть аккаунт?{" "}
          <span
            onClick={() => router.push("/Auth/Login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Войти
          </span>
        </p>
      </div>
    </div>
  );
}
