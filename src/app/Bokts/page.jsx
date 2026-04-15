"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumbs from "../../Components/Breadcrumbs";

export default function BoktCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dealers`);
        if (!res.ok) throw new Error("Ошибка загрузки банков");

        const data = await res.json();
        const onlyBanks = data.filter((dealer) => dealer.type === "BOKT");

        setCompanies(onlyBanks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBanks();
  }, []);




  if (loading) return <p className="text-center mt-20 text-slate-300">Загрузка...</p>;

  if (error) return <p className="text-center mt-20 text-red-300">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d1c] to-[#0b1f3a] py-10 px-4">
      {/* Хлебные крошки */}
      <div className="mb-6 max-w-6xl mx-auto rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Bokts" },
          ]}
        />
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          BOKT компании
        </h1>

        {companies.length === 0 ? (
          <p className="text-slate-400">Нет зарегистрированных BOKT</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {companies.map((c) => (
              <Link
                key={c._id}
                href={`/Bokts/${c.slug}`}
                className="block bg-[#08162c] border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-blue-500/40 transition text-white"
              >
                <h2 className="text-xl font-semibold mb-2">{c.name}</h2>
                <p className="text-slate-300 text-sm line-clamp-3 mb-4">
                  {c.description || "Описание отсутствует"}
                </p>
                <div className="text-sm">
                  {c.contacts?.phone && <p>📞 {c.contacts.phone}</p>}
                  {c.contacts?.email && <p>✉️ {c.contacts.email}</p>}
                  <p>🌍 {c.country}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}