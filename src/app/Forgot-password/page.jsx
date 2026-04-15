"use client";

import { useState } from "react";
import { apiRequest } from "../../Services/api.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await apiRequest("/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage("Код для восстановления отправлен на почту!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05204A] text-white">
      <form className="bg-primary p-8 rounded-lg shadow-lg w-96" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-6 text-center">Восстановление пароля</h1>
        {error && <div className="bg-red-500 p-2 rounded mb-4 text-center">{error}</div>}
        {message && <div className="bg-green-500 p-2 rounded mb-4 text-center">{message}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded mb-6 bg-[#4B6CB7] text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#1E90FF] py-3 rounded font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Отправка..." : "Отправить код"}
        </button>
      </form>
    </div>
  );
}
