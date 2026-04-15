"use client";
import { FaInstagram, FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [news, setNews] = useState([]);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/news`;

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const latest = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        setNews(latest);
      });
  }, []);

  return (
    <footer className="flex border-t border-slate-800 bg-slate-950 text-slate-200">
      <div className="w-87 hidden xl:flex"></div>
      <div className="w-full py-12">
        <div className="mb-10 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10 p-5 md:flex md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-blue-300">
              Dillers Company
            </p>
            <h3 className="mt-1 text-2xl font-bold text-white">
              Сравнивайте финансовые продукты быстро и удобно
            </h3>
          </div>
          <Link
            href="/Banks"
            className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500 md:mt-0"
          >
            Перейти к банкам
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <Link
              href="/News"
              className="mb-2 block font-semibold text-white"
            >
              Последние новости
            </Link>
            <Link
              href="/Advertisement"
              className="mb-4 block font-semibold text-white"
            >
              Реклама
            </Link>
            <ul className="mt-3 space-y-3 text-sm">
              {news.map((item) => (
                <li key={item._id}>
                  <Link
                    href={`/News/${encodeURIComponent(item.slug)}`}
                    className="block rounded-lg border border-transparent px-2 py-1 transition hover:border-slate-700 hover:bg-slate-900 hover:text-blue-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">
              Связаться с нами
            </h4>
            <div className="flex items-center gap-4 mb-4">
              <a className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 transition hover:border-pink-400 hover:text-pink-400">
                <FaInstagram />
              </a>
              <a className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 transition hover:border-green-400 hover:text-green-400">
                <FaWhatsapp />
              </a>
              <a className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 transition hover:border-blue-400 hover:text-blue-400">
                <FaTelegramPlane />
              </a>
            </div>
            <div className="space-y-1 text-sm text-slate-400">
              <p>📞 +994 77 777 77 77</p>
              <p>✉️ monadaz@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-slate-800 pt-6 text-sm text-slate-400 md:flex-row">
          <span>© {new Date().getFullYear()} Dillers Company</span>
          <span>Все права защищены</span>
        </div>
      </div>
      <div className="w-87 hidden xl:flex"></div>
    </footer>
  );
}
