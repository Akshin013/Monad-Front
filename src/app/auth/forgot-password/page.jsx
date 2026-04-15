"use client";

import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth.js";
import { useRouter } from "next/navigation"; // ✅ добавили

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const router = useRouter(); // ✅ добавили

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await forgotPassword(email);

    if (!res.success) {
      setError(res.message);
    } else {
      setMessage(res.message);

      // ✅ Редирект с email в query
      setTimeout(() => {
        router.push(`/Auth/Reset-password?email=${encodeURIComponent(email)}`);
      }, 800);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 px-4">
      <form
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Восстановление пароля
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center font-medium">
            {message}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-6 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? "Отправка..." : "Отправить код"}
        </button>

        <p
          className="mt-4 text-center text-sm text-blue-600 hover:underline cursor-pointer"
          onClick={() => window.history.back()}
        >
          Вернуться назад
        </p>
      </form>
    </div>
  );
}
