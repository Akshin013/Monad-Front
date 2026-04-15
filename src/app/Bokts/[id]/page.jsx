"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import Link from "next/link";

export default function BOKTDealerPage() {
  const { id } = useParams(); // slug
  const [dealer, setDealer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDealer = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dealers/${id}`);
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        const data = await res.json();
        setDealer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        // stop loading in both success and error cases
        setLoading(false);
      }
    };
    fetchDealer();
  }, [id]);

  useEffect(() => {
    if (!dealer?._id) return;
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?dealer=${dealer._id}&category=BOKT`
        );
        if (res.ok) {
          const data = await res.json();
          setProducts(data.filter(p => p.is_active && p.status === "APPROVED"));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [dealer]);

  if (loading) return <p className="text-center mt-20 text-slate-300">Загрузка...</p>;
  if (error) return <p className="text-center mt-20 text-red-300">{error}</p>;
  if (!dealer) return <p className="text-center mt-20 text-slate-400">Компания не найдена</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d1c] to-[#0b1f3a] py-10 px-4">
      {/* Хлебные крошки */}
      <div className="mb-6 max-w-6xl mx-auto rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Bokts", href: "/Bokts" },
            { label: dealer.name },
          ]}
        />
      </div>

      <div className="max-w-5xl mx-auto bg-[#08162c] border border-slate-800 p-8 rounded-2xl shadow-xl text-white">
        <h1 className="text-3xl font-bold mb-4">{dealer.name}</h1>
        {dealer.description && <p className="text-slate-300 mb-6">{dealer.description}</p>}

        {/* контакты */}
        <div className="space-y-1 mb-6 text-sm">
          {dealer.contacts?.phone && <p>📞 {dealer.contacts.phone}</p>}
          {dealer.contacts?.email && <p>✉️ {dealer.contacts.email}</p>}
          {dealer.address && <p>📍 {dealer.address}</p>}
        </div>

        <h2 className="text-2xl font-semibold mb-4">Продукты BOKT</h2>
        {products.length === 0 ? (
          <p className="text-slate-400">Нет доступных продуктов</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((prod) => (
              <div key={prod._id} className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-blue-500/40 transition">
                <h3 className="text-xl font-semibold mb-2">{prod.title}</h3>
                <p className="text-slate-300 mb-4 text-sm line-clamp-2">
                  {prod.description}
                </p>
                <Link
                  href={`/Products/${prod._id}`}
                  className="block bg-green-600 hover:bg-green-500 text-white text-center py-2 rounded-xl transition"
                >
                  Подробнее
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/Bokts"
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-xl transition"
          >
            Назад к списку
          </Link>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Вспомогательный компонент */
function Info({ label, children }) {
  return (
    <div className="bg-[#0b1f3a] rounded-xl p-4">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-white font-semibold">{children}</p>
    </div>
  );
}