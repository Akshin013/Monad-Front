"use client";
import React from "react";
import Link from "next/link";

const Home = () => {
  return (
     
    <div className="min-h-screen bg-gradient-to-b from-[#050d1c] to-[#0b1f3a] p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        Добро пожаловать
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-auto text-xl">
        {/* COLUMN 1 */}
        <div className="grid grid-rows-2 gap-4">
          <div className="h-40 flex justify-center items-center bg-blue-900 rounded-xl shadow-lg text-white font-semibold transition transform hover:scale-105 hover:shadow-2xl">
            Подбор кредита
          </div>
          <div className="h-40 flex justify-center items-center bg-blue-900 rounded-xl shadow-lg text-white font-semibold transition transform hover:scale-105 hover:shadow-2xl">
            КАСКО
          </div>
        </div>

        {/* COLUMN 2 */}
        <div className="grid grid-rows-[1fr_1fr] gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/Credits"
              className="h-40 flex justify-center items-center bg-blue-900 rounded-xl shadow-lg text-white font-semibold transition transform hover:scale-105 hover:shadow-2xl"
            >
              Кредиты
            </Link>
            <Link
              href="/Cards?tab=CREDIT"
              className="h-40 flex justify-center items-center bg-blue-900 rounded-xl shadow-lg text-white font-semibold transition transform hover:scale-105 hover:shadow-2xl"
            >
              Кредитные карты
            </Link>
          </div>
          <Link
            href="/Cards?tab=DEBIT"
            className="h-40 flex justify-center items-center bg-blue-900 rounded-xl shadow-lg text-white font-semibold transition transform hover:scale-105 hover:shadow-2xl"
          >
            Дебетовые карты
          </Link>
        </div>

        {/* COLUMN 3 */}
        <div className="grid grid-rows-[1fr_1fr] gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/Credits/Auto"
              className="h-40 flex justify-center items-center bg-blue-900 rounded-xl shadow-lg text-white font-semibold transition transform hover:scale-105 hover:shadow-2xl"
            >
              Автокредиты
            </Link>
            <div className="h-40 flex justify-center text-center items-center bg-blue-900 rounded-xl shadow-lg text-white font-semibold transition transform hover:scale-105 hover:shadow-2xl">
              Банки Азербайджана
            </div>
          </div>
          <div className="h-40 flex justify-center items-center bg-blue-900 rounded-xl shadow-lg text-white font-semibold transition transform hover:scale-105 hover:shadow-2xl">
            Подбор карт
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
