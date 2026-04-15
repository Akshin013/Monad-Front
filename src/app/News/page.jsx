"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumbs from "../../Components/Breadcrumbs";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/news`;

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-10">Загрузка...</div>;
  }

  if (!news.length) {
    return (
      <p className="text-center text-slate-400 mt-10">
        Новостей пока нет
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="bg-transparent px-4 mb-6">
        <Breadcrumbs
          items={[{ label: "Главная", href: "/" }, { label: "Новости" }]}
        />
      </div>

      <h1 className="text-3xl font-bold mb-8">Новости</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {news.map(item => (
          <Link
            key={item._id}
            href={`/News/${encodeURIComponent(item.slug)}`}
            className="group bg-[#0b2c5a] rounded-2xl overflow-hidden shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* Картинка */}
            {item.image && (
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-48 w-full object-cover transition group-hover:scale-105"
                />
              </div>
            )}

            {/* Контент */}
            <div className="p-4 space-y-2">
              {/* Дата */}
              <p className="text-xs text-slate-300">
                {new Date(item.createdAt).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              {/* Заголовок */}
              <h2 className="text-lg font-semibold leading-snug line-clamp-2">
                {item.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
