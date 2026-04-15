"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "../../../Components/Breadcrumbs";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/news`;

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherNews, setOtherNews] = useState([]);

  useEffect(() => {
    if (!slug) return;

    fetch(`${API_URL}/${encodeURIComponent(slug)}`)
      .then(res => res.json())
      .then(setNews)
      .catch(() => setNews(null))
      .finally(() => setLoading(false));
  }, [slug]);

  // Подгружаем другие новости для "Читайте также"
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setOtherNews(data.filter(n => n.slug !== slug).slice(0, 3)))
      .catch(() => setOtherNews([]));
  }, [slug]);

  if (loading) return <div className="py-20 text-center">Загрузка…</div>;
  if (!news) return <div className="py-20 text-center">Новость не найдена</div>;

  const date = new Date(news.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Breadcrumbs */}
      <div className="bg-transparent px-4 mb-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Новости", href: "/News" },
            { label: `${news.title}` }
          ]}
        />
      </div>

      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          {news.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs">
              {news.category || "Новости"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>🗓 {date}</span>
          </div>
        </div>
      </header>

      {/* IMAGE */}
      {news.image && (
        <div className="mb-10">
          <img
            src={news.image}
            alt={news.title}
            className="
              w-full
              max-h-[420px]
              object-cover
              rounded-2xl
              shadow-xl
            "
          />
        </div>
      )}

      {/* CONTENT */}
      <article
        className="
          prose
          prose-invert
          prose-lg
          max-w-none
        "
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

      {/* TAGS */}
      {news.tags?.length > 0 && (
        <div className="mt-10 border-t border-slate-700 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-400">Теги:</span>
            {news.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full bg-slate-700/50 text-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SHARE с красивой полоской */}
      <div className="mt-12 border-t border-slate-700 pt-4 flex flex-wrap items-center gap-4">
        <span className="text-sm text-slate-400">Поделиться:</span>
        <button className="hover:text-blue-400 text-xl">📘</button>
        <button className="hover:text-blue-400 text-xl">💼</button>
        <button className="hover:text-blue-400 text-xl">✈️</button>
      </div>

      {/* ЧИТАЙТЕ ТАКЖЕ */}
      {otherNews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Читайте также</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherNews.map(item => (
              <Link
                key={item._id}
                href={`/News/${encodeURIComponent(item.slug)}`}
                className="block bg-[#0b2c5a] rounded-xl overflow-hidden shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-36 w-full object-cover transition group-hover:scale-105"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(item.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* BACK */}
      <div className="mt-12">
        <Link
          href="/News"
          className="text-sm text-blue-400 hover:underline"
        >
          ← Назад к новостям
        </Link>
      </div>
    </div>
  );
}
