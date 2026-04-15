// components/AdminWrapper.jsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../app/Context/AuthContext";

export default function AdminWrapper({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/Login"); // если не админ, кидаем на логин
    }
  }, [user, router]);

  if (!user || user.role !== "ADMIN") return null; // пока не проверили — ничего не показываем

  return <div className="min-h-screen flex">{children}</div>;
}
