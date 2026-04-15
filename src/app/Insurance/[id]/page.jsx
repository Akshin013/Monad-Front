"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import useProductView from "../../../hooks/useProductView";
import useProductClick from "../../../hooks/useProductClick";

export default function InsuranceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Учет просмотров страницы
  useProductView(id);

  // ✅ Хук для кликов по кнопке перехода на сайт
  const sendClick = useProductClick(id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить данные продукта");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-20 text-lg text-slate-300">Загрузка...</p>;

  if (error)
    return <p className="text-center mt-20 text-red-300 text-lg">{error}</p>;

  if (!product)
    return (
      <p className="text-center mt-20 text-white text-lg">
        Продукт не найден
      </p>
    );

  const ins = product.insurance;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-[#0b1f3a] py-10 px-4">
      {/* Breadcrumbs */}
      <div className="max-w-6xl mx-auto bg-slate-900/70 border border-slate-800 rounded-lg px-6 py-4 flex justify-between items-center">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Страхование", href: "/Insurance" },
            { label: product.title },
          ]}
        />
      </div>

      <div className="max-w-5xl mx-auto bg-slate-900/70 border border-slate-800 rounded-2xl p-8 mt-10 space-y-6">
        {/* Заголовок */}
        <h1 className="text-4xl font-bold text-white">{product.title}</h1>
        {ins.shortDescription && (
          <p className="text-white/90 text-lg">{ins.shortDescription}</p>
        )}

        {/* Преимущества */}
        {ins.benefits?.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">✅</span> Преимущества
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {ins.benefits.map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3 shadow-sm"
                >
                  <span className="mt-1 text-green-500 text-lg">🟢</span>
                  <p className="text-slate-700 text-sm leading-snug">{b}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Что покрывается */}
        {ins.risksCovered?.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🛡️</span> Что покрывается
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {ins.risksCovered.map((r, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 shadow-sm"
                >
                  <span className="mt-1 text-blue-500 text-lg">🔵</span>
                  <p className="text-slate-700 text-sm leading-snug">{r}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Исключения */}
        {ins.exclusions?.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">⛔</span> Исключения
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {ins.exclusions.map((e, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 shadow-sm"
                >
                  <span className="mt-1 text-red-400 text-lg">🔴</span>
                  <p className="text-slate-700 text-sm leading-snug">{e}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Основные параметры */}
        <div className="grid md:grid-cols-2 gap-6">
          {ins.insuranceSum && (
            <Info label="Страховая сумма">
              {ins.insuranceSum.min} — {ins.insuranceSum.max} ₼
            </Info>
          )}
          {ins.franchise?.available && (
            <Info label="Франшиза">{ins.franchise.amount} ₼</Info>
          )}
          {ins.basePrice && <Info label="Базовая цена">{ins.basePrice} ₼</Info>}
          {ins.durationOptions?.length > 0 && (
            <Info label="Доступные сроки">
              {ins.durationOptions.join(", ")} месяцев
            </Info>
          )}
        </div>

        {/* Кнопки и статус */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {ins.websiteUrl && (
            <a
              href={ins.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={sendClick}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-center font-semibold transition"
            >
              Перейти на сайт банка / страховой
            </a>
          )}
          <button
            onClick={() => router.push("/Insurance")}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl text-center transition"
          >
            Назад к списку
          </button>
          <span
            className={`px-4 py-2 rounded-full font-semibold self-start ${
              product.status === "APPROVED"
                ? "bg-green-100 text-green-800"
                : product.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {product.status}
          </span>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Карточка с заголовком */
function Card({ title, children }) {
  return (
    <div className="bg-primary-dark rounded-xl p-6 shadow-md">
      <h3 className="font-semibold text-white mb-3">{title}</h3>
      {children}
    </div>
  );
}

/* 🔹 Маленький компонент для параметров */
function Info({ label, children }) {
  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
      <p className="text-slate-500 text-sm mb-1">{label}</p>
      <p className="text-slate-100 font-semibold">{children}</p>
    </div>
  );
}
