"use client";

import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md">
        <h1 className="text-6xl font-extrabold text-blue-600 mb-6">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Ой! Страница не найдена
        </h2>
        <p className="text-gray-600 mb-8">
          Возможно, вы перешли по неверной ссылке или страница была удалена.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-500 transition"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
