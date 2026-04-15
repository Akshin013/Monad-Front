"use client";
import { useEffect, useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams(); // берём ID из маршрута
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const errorPage = () => {
      router.push("/404") 
  }
  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">Загрузка продукта...</p>
    );
  // if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
if (error) {
  errorPage(); 
  return
}

  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-b from-[#f0f4f8] to-[#d9e2ec] rounded-2xl shadow-md p-6 mt-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
      <p className="text-gray-500 mb-4">
        Категория: {product.category}{" "}
        {product.subtype ? `- ${product.subtype}` : ""}
      </p>

      {product.category === "INSURANCE" &&
        product.insurance?.shortDescription && (
          <p className="text-gray-700 mb-4">
            {product.insurance.shortDescription}
          </p>
        )}

      {product.category === "INSURANCE" &&
        product.insurance?.benefits?.length > 0 && (
          <ul className="mb-4 list-disc list-inside text-gray-600">
            {product.insurance.benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}

      {product.category === "CARD" && (
        <div className="text-gray-700 mb-4">
          {product.subtype === "CREDIT_CARD" && (
            <>
              <p>💳 Лимит: {product.card?.creditLimit || 0} ₼</p>
              <p>🎁 Кешбек: {product.card?.cashbackPercent || 0}%</p>
            </>
          )}
          <p>
            📅 Обслуживание:{" "}
            {product.card?.freeService
              ? "Бесплатно"
              : `${product.card?.annualFee || 0} ₼ / год`}
          </p>
        </div>
      )}

      {product.category === "CREDIT" && (
        <div className="text-gray-700 mb-4">
          <p>💰 Лимит кредита: {product.credit?.limit || 0} ₼</p>
          <p>🗓 Срок: {product.credit?.term || 0} мес.</p>
        </div>
      )}

      {product.dealer?.slug && (
        <Link
          href={`/Banks/${product.dealer.slug}`}
          className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition"
        >
          Перейти к банку
        </Link>
      )}

      <span
        className={`inline-block mt-4 px-3 py-1 rounded-full text-sm font-semibold ${
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
  );
}
