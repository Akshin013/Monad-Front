"use client";

import { useState, useEffect } from "react";
// import { useAuth } from "../../Context/AuthContext";
import { useAuth } from "../../../hooks/useAuth.js";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Автоподстановка email из URL (?email=...)
  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setFormData((prev) => ({
        ...prev,
        email: emailFromQuery,
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess("");

    const data = await login(
      formData.email,
      formData.password
    );

    if (data?.user) {
      setSuccess("✅ Вы успешно вошли!");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      setMessage(data?.message || "Ошибка входа");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Вход
        </h2>

        {message && (
          <p className="mb-4 text-center text-red-600 font-medium">
            {message}
          </p>
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
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <p
            className="text-sm text-blue-600 cursor-pointer hover:underline text-right"
            onClick={() =>
              router.push(`/Auth/Forgot-password?role=${formData.role}`)
            }
          >
            Забыли пароль?
          </p>


          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow hover:from-blue-600 hover:to-indigo-700 transition-all"
          >
            Войти
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Нет аккаунта?{" "}
          <span
            onClick={() => router.push("/Become-dealer")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Зарегистрироваться
          </span>
        </p>
      </div>
    </div>
  );
}
