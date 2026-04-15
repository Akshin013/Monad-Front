"use client";

import { useState } from "react";
// import { useAuth } from "../../Context/AuthContext";
import { useAuth } from "../../../hooks/useAuth.js";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Жёстко указываем роль ADMIN
    const data = await login(formData.email, formData.password, "ADMIN");

    if (data.user) {
      // проверяем, что роль действительно ADMIN
      if (data.user.role !== "ADMIN") {
        setMessage("Доступ запрещён: вы не админ");
        return;
      }

      router.push("/Admin"); // редирект на админ панель
    } else {
      setMessage(data.message || "Неверный email или пароль");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/85 p-8 shadow-2xl"
      >
        <p className="mb-2 text-center text-xs uppercase tracking-[0.2em] text-slate-400">
          Dillers Admin
        </p>
        <h2 className="mb-2 text-center text-2xl font-bold text-white">
          Вход для Админа
        </h2>
        <p className="mb-5 text-center text-sm text-slate-400">
          Введите email и пароль администратора
        </p>
        {message && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-red-300">
            {message}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 p-2 font-semibold text-white transition hover:bg-blue-500"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
