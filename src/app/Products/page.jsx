"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts } from "../../Services/products.js";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  
  const categories = [
    { key: "ALL", label: "Все" },
    { key: "CARD", label: "Карты" },
    { key: "CREDIT", label: "Кредиты" },
    { key: "INSURANCE", label: "Страхование" },
  ];

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  // Фильтруем продукты по категории
  const filteredProducts =
    activeCategory === "ALL"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gradient-to-b from-[#f0f4f8] to-[#d9e2ec]">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
        Продукты банков
      </h1>

      {/* Выбор категории */}
      <ul className="flex mt-10 gap-4 justify-center mb-10">
        {categories.map((type) => (
          <li
            key={type.key}
            onClick={() => setActiveCategory(type.key)}
            className={`cursor-pointer px-4 py-2 rounded-full font-medium transition ${
              activeCategory === type.key
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type.label}
          </li>
        ))}
      </ul>

      {/* Сетка карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="text-center col-span-full text-gray-400">
            Продукты не найдены...
          </p>
        ) : (
          filteredProducts.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-900">
                {p.title}
              </h2>

              <p className="text-gray-600 mb-4">
                {p.category === "INSURANCE" && p.insurance?.shortDescription}
                {p.category === "CARD" &&
                  (p.subtype === "CREDIT_CARD"
                    ? `💳 Лимит: ${p.card?.creditLimit || 0} ₼`
                    : "")}
                {p.category === "CREDIT" &&
                  `💰 Лимит кредита: ${p.credit?.limit || 0} ₼`}
              </p>

              <Link
                href={`/Products/${p._id}`}
                className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition"
              >
                Подробнее
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
