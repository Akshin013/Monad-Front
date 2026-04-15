"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function BannerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchBanner = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Ошибка загрузки");

      const data = await res.json();
      setBanner(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBanner();
  }, [id]);

  const approveBanner = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBanner();
  };

  const rejectBanner = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/${id}/reject`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBanner();
  };

  const deleteBanner = async () => {
    if (!confirm("Удалить баннер?")) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    router.push("/Admin/Banners");
  };

  if (loading)
    return <div className="p-10 text-slate-400">Загрузка...</div>;

  if (!banner)
    return <div className="p-10 text-red-300">Баннер не найден</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-6 text-slate-100">
        {/* Назад */}
        <Link
          href="/Admin/Banners"
          className="text-blue-300 hover:underline text-sm"
        >
          ← Назад к баннерам
        </Link>

        {/* Изображение */}
        <img
          src={banner.image}
          alt={banner.title}
          className="w-full max-h-[400px] object-contain rounded-lg border border-slate-700 bg-slate-950"
        />

        {/* Основная информация */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{banner.title}</h1>

            <p className="mt-2">
              <span className="font-semibold">Ссылка:</span>{" "}
              <a
                href={banner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 underline"
              >
                {banner.link}
              </a>
            </p>

            <p className="mt-2">
              <span className="font-semibold">Тип:</span> {banner.type}
            </p>

            <p className="mt-2">
              <span className="font-semibold">Устройство:</span>{" "}
              {banner.device}
            </p>

            <p className="mt-2">
              <span className="font-semibold">Размер:</span>{" "}
              {banner.size?.width}×{banner.size?.height}px
            </p>

            <p className="mt-2">
              <span className="font-semibold">Статус:</span>{" "}
              {banner.approved ? (
                <span className="text-green-600 font-semibold">
                  Approved
                </span>
              ) : (
                <span className="text-yellow-600 font-semibold">
                  Pending
                </span>
              )}
            </p>
          </div>

          {/* Статистика */}
          <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800">
            <h2 className="text-lg font-semibold mb-3">
              📊 Статистика
            </h2>

            <p>Просмотры: {banner.views}</p>
            <p>Клики: {banner.clicks}</p>

            <p className="mt-3 text-sm text-slate-400">
              CTR:{" "}
              {banner.views > 0
                ? ((banner.clicks / banner.views) * 100).toFixed(2)
                : 0}
              %
            </p>

            <p className="mt-3 text-sm">
              Период:
              <br />
              {banner.startDate
                ? new Date(banner.startDate).toLocaleDateString()
                : "Без начала"}{" "}
              —{" "}
              {banner.endDate
                ? new Date(banner.endDate).toLocaleDateString()
                : "Без окончания"}
            </p>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 pt-4 border-t border-slate-800">
          {!banner.approved && (
            <button
              onClick={approveBanner}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Approve
            </button>
          )}

          <button
            onClick={rejectBanner}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Reject
          </button>

          <button
            onClick={deleteBanner}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}