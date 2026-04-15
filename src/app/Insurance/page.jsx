"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Link from "next/link";

const insuranceTypes = [
  { key: "ALL", label: "Все" },
  { key: "AUTO_INSURANCE", label: "Авто" },
  { key: "PROPERTY_INSURANCE", label: "Недвижимость" },
  { key: "LIFE_INSURANCE", label: "Жизнь" },
];

export default function InsuranceProductsPage() {
  const [products, setProducts] = useState([]);
  const [activeType, setActiveType] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  useEffect(() => {
    const fetchInsurance = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?category=INSURANCE`
        );
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsurance();
  }, []);

  const filtered = products.filter((p) =>
    activeType === "ALL" ? true : p.subtype === activeType
  );

  if (loading)
    return <p className="text-center mt-10 text-lg text-slate-300">Загрузка...</p>;
  if (error) return <p className="text-center mt-10 text-red-400">{error}</p>;
  if (products.length === 0)
    return <p className="text-center mt-10 text-slate-400">Нет страховых продуктов</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-[#0b1f3a] py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">Страховые продукты</h1>
      <div className="max-w-7xl mx-auto rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
          <Breadcrumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Страхования" },
            ]}
          />
        </div>
      {/* FILTER TABS */}
      <ul className="mt-10 mb-10 flex flex-wrap gap-3 justify-center">
        {insuranceTypes.map((type) => (
          <li
            key={type.key}
            onClick={() => setActiveType(type.key)}
            className={`cursor-pointer px-4 py-2 rounded-full font-medium transition ${
              activeType === type.key
                ? "bg-blue-600 text-white shadow"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {type.label}
          </li>
        ))}
      </ul>

      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <div
            key={product._id}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500/40 transition"
          >
            <h2 className="text-xl font-semibold mb-2 text-white">{product.title}</h2>
            {product.insurance?.shortDescription && (
              <p className="text-slate-300 mb-4">{product.insurance.shortDescription}</p>
            )}

            {product.insurance?.benefits?.length > 0 && (
              <ul className="mb-4 list-disc list-inside text-slate-400">
                {product.insurance.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}

            <div className="mt-auto flex justify-between items-center">
              <a
                href={`/Insurance/${product._id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
              >
                Подробнее
              </a>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
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
        ))}
      </div>
    </div>
  );
}
