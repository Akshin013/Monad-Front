"use client";
"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "../../Services/auth.js";
// import { apiRequest } from "@/Services/auth.js";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/verify", {
        method: "POST",
        body: JSON.stringify({ email: emailFromQuery, code }),
      });
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05204A] text-white">
      <form className="bg-primary p-8 rounded-lg shadow-lg w-96" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-6 text-center">Подтверждение Email</h1>
        {error && <div className="bg-red-500 p-2 rounded mb-4 text-center">{error}</div>}

        <input
          type="email"
          value={emailFromQuery}
          readOnly
          className="w-full p-3 rounded mb-4 bg-[#4B6CB7] text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
        />
        <input
          type="text"
          placeholder="Код из письма"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 rounded mb-6 bg-[#4B6CB7] text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#1E90FF] py-3 rounded font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Проверка..." : "Подтвердить"}
        </button>
      </form>
    </div>
  );
}
