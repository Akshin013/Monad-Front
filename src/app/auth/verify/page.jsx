"use client";

import { useState } from "react";
import { verifyEmail } from "../../../Services/auth.js";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    // ⚡ Исправлено: передаем email и code
    const data = await verifyEmail(emailFromQuery, code);

    if (data.token) {
      localStorage.setItem("token", data.token);
      setSuccess("Email успешно подтверждён!");

      setTimeout(() => {
        router.push("/Auth/Login");
      }, 1200);
    } else {
      throw new Error(data.message || "Неверный код подтверждения");
    }
  } catch (err) {
    setError(err.message || "Ошибка подтверждения");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05204A] px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-primary p-8 rounded-xl shadow-2xl w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Подтверждение Email
        </h1>

        {error && (
          <div className="bg-red-500/90 p-2 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/90 p-2 rounded mb-4 text-center text-sm">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            value={emailFromQuery}
            readOnly
            className="w-full p-3 rounded bg-[#4B6CB7] text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
          />

          <input
            type="text"
            placeholder="Код из письма"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full p-3 rounded bg-[#4B6CB7] text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !code}
          className="w-full mt-6 bg-[#1E90FF] py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Проверка..." : "Подтвердить"}
        </button>

        <p
          className="mt-4 text-center text-sm text-blue-200 hover:underline cursor-pointer"
          onClick={() => router.push("/Auth/Login")}
        >
          Вернуться ко входу
        </p>
      </form>
    </div>
  );
}
