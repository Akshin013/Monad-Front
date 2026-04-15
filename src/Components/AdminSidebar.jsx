// components/AdminSidebar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ADMIN_NAV_LINKS = [
  { name: "📊 Дашборд", href: "/Admin" },
  { name: "👥 Пользователи", href: "/Admin/Users" },
  { name: "🏢 Дилеры", href: "/Admin/Dealers" },
  { name: "📦 Продукты", href: "/Admin/Products" },
  { name: "🖼️ Баннеры", href: "/Admin/Banners" },
  { name: "📨 Заявки", href: "/Admin/DealerRequests" },
  { name: "📣 Реклама", href: "/Admin/Advertisements" },
  { name: "🛠️ Site off", href: "/Admin/Site-off" },
];

export default function AdminSidebar({ mobile = false, onNavigate }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/Admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
<aside
  className={`${
    mobile
      ? "h-full w-72 bg-slate-900 p-6 "
      : "sticky top-0 hidden h-screen  w-72 border-r border-slate-800 bg-slate-900/95 p-6 shadow-2xl lg:block"
  }`}
>
      <div className="mb-8 ">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Dillers
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Admin Panel
        </h1>
        <p className="mt-2 text-sm text-slate-400">Управление сервисом</p>
      </div>

      <nav className="flex flex-col gap-2">
        {ADMIN_NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`
              group relative flex  items-center gap-3 rounded-xl p-3 transition-all duration-200
              ${
                isActive(link.href)
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }
            `}
          >
            <span className="font-medium">{link.name}</span>

            {isActive(link.href) && (
              <div className="absolute inset-y-2 left-1 w-1 rounded-full bg-white/80" />
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400">
        Выберите раздел слева, чтобы быстро перейти к нужной категории.
      </div>
    </aside>
  );
}
