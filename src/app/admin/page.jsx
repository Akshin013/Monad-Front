"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/Admin/Login");
    }
  }, [router]);

  return (
    <div className="flex items-center  min-h-screen bg-slate-950 text-slate-100">
      {/* <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-indigo-500/10 p-6 md:col-span-2">
        <h2 className="text-2xl font-bold text-white">Добро пожаловать в админку</h2>
        <p className="mt-2 max-w-2xl text-slate-300">
          Управляйте пользователями, баннерами, дилерами и заявками из единой
          панели. Выберите раздел в сайдбаре, чтобы начать работу.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-sm text-slate-400">Быстрые действия</p>
        <div className="mt-4 space-y-2 text-sm">
          <p className="rounded-lg bg-slate-800 px-3 py-2 text-slate-200">
            /Admin/Users
          </p>
          <p className="rounded-lg bg-slate-800 px-3 py-2 text-slate-200">
            /Admin/Products
          </p>
          <p className="rounded-lg bg-slate-800 px-3 py-2 text-slate-200">
            /Admin/Banners
          </p>
        </div>
      </div> */}
    
    <img src="https://res.cloudinary.com/dvm6my9na/image/upload/v1773315516/png1_urfxxj.png" alt="Admin Dashboard" />
    </div>
  );
}
