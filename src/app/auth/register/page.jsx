"use client";

import { useState } from "react";
// import { useAuth } from "../../Context/AuthContext";
import { useAuth } from "../../../hooks/useAuth.js";
import { useSearchParams, useRouter } from "next/navigation";

export default function Register() {
  const { register } = useAuth();
  const searchParams = useSearchParams();
  // no normal users any more; all registrations create DEALER accounts
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    role: "DEALER",
    companyName: "",
    type: "BANK",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await register(formData);
    setMessage(data.message);

    if (!data.error) {
      router.push(`/Auth/Verify?email=${formData.email}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Регистрация (дилер)</h2>

        {message && (
          <p className="mb-4 text-center text-red-600 font-medium">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="text"
            name="phone"
            placeholder="Телефон"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          {formData.role === "DEALER" && (
            <>
              <input
                type="text"
                name="companyName"
                placeholder="Название компании"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="BANK">Банк</option>
                <option value="INSURANCE">Страховая</option>
                <option value="MFI">МФО</option>
              </select>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
          >
            Зарегистрироваться
          </button>
        </form>

        <p
          className="mt-4 text-center text-sm text-blue-500 hover:underline cursor-pointer"
          onClick={() => router.push("/Auth/Login")}
        >
          Уже есть аккаунт? Войти
        </p>
      </div>
    </div>
  );
}
