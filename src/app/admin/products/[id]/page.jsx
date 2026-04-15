"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// import { useAuth } from "../../../Context/AuthContext";
import { useAuth } from "../../../../hooks/useAuth.js";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, token]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const { _id, __v, createdAt, updatedAt, ...cleanData } = product;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cleanData),
        }
      );

      if (!res.ok) throw new Error("Ошибка сохранения");

      alert("✅ Продукт сохранён");
      router.back();
    } catch (err) {
      alert("❌ Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setProduct((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-slate-900/70 border border-slate-800 p-10 rounded-xl text-slate-400">
          Требуется авторизация
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Продукт не найден
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            ✏️ Редактирование продукта
          </h1>
          <p className="text-blue-100 mt-1 text-sm">
            ID: {product._id?.slice(-8)}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Основные поля */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold text-slate-300">
                Название
              </label>
              <input
                className="w-full border border-slate-700 bg-slate-950 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/30 transition"
                value={product.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-slate-300">
                Описание
              </label>
              <textarea
                rows="3"
                className="w-full border border-slate-700 bg-slate-950 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500/30 transition"
                value={product.description || ""}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
              />
            </div>
          </div>

          {/* Селекты */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block mb-2 font-semibold text-slate-300">
                Категория
              </label>
              <select
                className="w-full border border-slate-700 bg-slate-950 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/30 transition"
                value={product.category}
                onChange={(e) =>
                  handleChange("category", e.target.value)
                }
              >
                <option value="CARD">Карты</option>
                <option value="CREDIT">Кредиты</option>
                <option value="INSURANCE">Страхование</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-slate-300">
                Подтип
              </label>
              <input
                className="w-full border border-slate-700 bg-slate-950 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/30 transition"
                value={product.subtype}
                onChange={(e) =>
                  handleChange("subtype", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-slate-300">
                Статус
              </label>
              <select
                className="w-full border border-slate-700 bg-slate-950 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/30 transition"
                value={product.status}
                onChange={(e) =>
                  handleChange("status", e.target.value)
                }
              >
                <option value="PENDING">Ожидает</option>
                <option value="APPROVED">Одобрено</option>
                <option value="REJECTED">Отклонено</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-3 w-full border border-slate-700 rounded-lg p-3 cursor-pointer hover:border-blue-500 transition">
                <input
                  type="checkbox"
                  checked={product.is_active}
                  onChange={(e) =>
                    handleChange("is_active", e.target.checked)
                  }
                  className="w-5 h-5"
                />
                <span className="font-semibold text-slate-300">
                  Активно
                </span>
              </label>
            </div>
          </div>

          {/* CREDIT */}
          {product.category === "CREDIT" && product.credit && (
            <div className="border-2 border-green-200 bg-green-50 p-6 rounded-xl">
              <h3 className="font-bold text-green-800 mb-4">
                💳 Параметры кредита
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ["minAmount", "Мин. сумма"],
                  ["maxAmount", "Макс. сумма"],
                  ["interestRateFrom", "Ставка от %"],
                  ["interestRateTo", "Ставка до %"],
                ].map(([field, label]) => (
                  <div key={field}>
                    <label className="block mb-1 text-sm font-medium">
                      {label}
                    </label>
                    <input
                      type="number"
                      className="w-full border rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-green-500 transition"
                      value={product.credit[field] || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          "credit",
                          field,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CARD */}
          {product.category === "CARD" && product.card && (
            <div className="border-2 border-purple-200 bg-purple-50 p-6 rounded-xl">
              <h3 className="font-bold text-purple-800 mb-4">
                💳 Параметры карты
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  ["creditLimit", "Кредитный лимит"],
                  ["cashbackPercent", "Кэшбэк %"],
                  ["annualFee", "Годовое обслуживание"],
                ].map(([field, label]) => (
                  <div key={field}>
                    <label className="block mb-1 text-sm font-medium">
                      {label}
                    </label>
                    <input
                      type="number"
                      className="w-full border rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 transition"
                      value={product.card[field] || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          "card",
                          field,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-800">
            <button
              onClick={() => router.back()}
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition font-semibold"
            >
              Назад
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition font-semibold shadow-lg disabled:opacity-50"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
