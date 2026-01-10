"use client";

import { useState } from "react";
import { useAuth } from "@/app/Context/AuthContext";
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

      router.push("/admin"); // редирект на админ панель
    } else {
      setMessage(data.message || "Неверный email или пароль");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Вход для Админа
        </h2>
        {message && (
          <p className="mb-4 text-red-600 text-center">{message}</p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
