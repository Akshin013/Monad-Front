"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import Breadcrumbs from "./Breadcrumbs";

const LABELS = {
  Admin: "Админ",
  Users: "Пользователи",
  Dealers: "Дилеры",
  Products: "Продукты",
  Banners: "Баннеры",
  Create: "Создать",
  Advertisements: "Реклама",
  DealerRequests: "Заявки",
  "Site-off": "Отключение сайта",
  Maintenance: "Техобслуживание",
  Upload: "Загрузка",
  Login: "Вход",
  Register: "Регистрация",
};

function toLabel(segment, isLast) {
  if (LABELS[segment]) return LABELS[segment];
  if (isLast && /^[a-f0-9]{8,}$/i.test(segment)) return "Детали";
  return decodeURIComponent(segment);
}

export default function AdminLayoutShell({ children }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthPage =
    pathname?.startsWith("/Admin/Login") || pathname?.startsWith("/Admin/Register");

  const allParts = useMemo(
    () => (pathname || "").split("/").filter(Boolean),
    [pathname]
  );

  const breadcrumbs = useMemo(() => {
    // Не показываем "Админ" в breadcrumbs — это уже видно в заголовке/layout.
    const parts = allParts[0] === "Admin" ? allParts.slice(1) : allParts;
    if (!parts.length) return [];

    return parts.map((part, idx) => {
      const href = `/${(allParts[0] === "Admin" ? ["Admin", ...parts] : parts)
        .slice(0, (allParts[0] === "Admin" ? idx + 2 : idx + 1))
        .join("/")}`;
      return {
        label: toLabel(part, idx === parts.length - 1),
        href: idx < parts.length - 1 ? href : undefined,
      };
    });
  }, [allParts]);

  const currentTitle =
    breadcrumbs[breadcrumbs.length - 1]?.label ||
    (allParts[0] === "Admin" ? "Админ" : "Панель");

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 lg:flex">
      <div className="hidden  lg:block">
        <AdminSidebar />
      </div>

      <div className="flex-1">

        <div className="p-4 md:p-6">{children}</div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-[70] h-full transform transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full w-[86vw] max-w-[320px] border-r border-slate-800 bg-slate-900 shadow-2xl">
          <div className="flex justify-end p-3">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-700 bg-slate-800 text-slate-200"
              aria-label="Закрыть меню админа"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <AdminSidebar mobile onNavigate={() => setMenuOpen(false)} />
        </div>
      </div>
    </div>
  );
}
