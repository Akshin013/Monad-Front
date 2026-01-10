
// components/AdminSidebar.jsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const router = useRouter();
  const links = [
    { name: "Dashboard", href: "/admin" },
    { name: "Пользователи", href: "/admin/users" },
    { name: "Дилеры", href: "/admin/dealers" },
    { name: "Баннеры", href: "/admin/products" },
  ];

  return (
    <div className="w-64 bg-[#0B3D91] p-6 flex flex-col gap-4 shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Admin Panel</h1>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`p-3 rounded hover:bg-[#1E90FF] transition-colors text-center`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}
