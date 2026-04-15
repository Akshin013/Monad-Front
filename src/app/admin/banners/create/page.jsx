"use client";
import { useState } from "react";

export default function CreateBannerPage() {
  const [formData, setFormData] = useState({
    title: "",
    image: "", // URL если без файла
    imageFile: null, // файл если загружаем
    imageUrl: "", // превью
    link: "",
    type: "TOP_DESKTOP",
    width: 728,
    height: 90,
    device: "ALL",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const bannerTypes = [
    "TOP_DESKTOP",
    "SIDE_DESKTOP",
    "CENTER_DESKTOP",
    "BACKGROUND",
    "CATFISH",
    "GALLERY",
    "TOP_MOBILE",
    "CENTER_MOBILE",
  ];

  const devices = ["DESKTOP", "MOBILE", "ALL"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      image: "",
    }));

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Войдите как администратор");

      let res;

      // ============================
      // 📸 ЕСЛИ ЕСТЬ ФАЙЛ → UPLOAD
      // ============================
      if (formData.imageFile) {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("link", formData.link);
        data.append("type", formData.type);
        data.append("width", formData.width);
        data.append("height", formData.height);
        data.append("device", formData.device);
        if (formData.startDate)
          data.append("startDate", formData.startDate);
        if (formData.endDate)
          data.append("endDate", formData.endDate);
        data.append("imageFile", formData.imageFile);

        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        });
      } 
      // ============================
      // 📝 ЕСЛИ ФАЙЛА НЕТ → JSON
      // ============================
      else {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            image: formData.image,
            link: formData.link,
            type: formData.type,
            size: {
              width: Number(formData.width),
              height: Number(formData.height),
            },
            device: formData.device,
            startDate: formData.startDate || null,
            endDate: formData.endDate || null,
          }),
        });
      }

      if (!res.ok) throw new Error("Ошибка при создании баннера");

      setMessage("Баннер успешно создан");
      setFormData({
        title: "",
        image: "",
        imageFile: null,
        imageUrl: "",
        link: "",
        type: "TOP_DESKTOP",
        width: 728,
        height: 90,
        device: "ALL",
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Ошибка сервера");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-3xl space-y-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden text-slate-100">
          <div className="px-6 py-4 border-b border-slate-800">
            <h1 className="text-2xl font-bold text-white">
              Создание баннера
            </h1>
            <p className="text-sm text-slate-400">
              Можно загрузить файл или вставить ссылку на картинку
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {message && (
              <div
                className={`px-4 py-2 rounded text-sm ${
                  message.includes("успешно")
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                    : "bg-red-500/10 text-red-300 border border-red-500/30"
                }`}
              >
                {message}
              </div>
            )}

            <input
              type="text"
              name="title"
              placeholder="Название"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
            />

            <input
              type="text"
              name="link"
              placeholder="Ссылка"
              value={formData.link}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
            />

            {/* URL картинки */}
            <input
              type="text"
              name="image"
              placeholder="URL изображения (если не загружаешь файл)"
              value={formData.image}
              onChange={handleChange}
              disabled={!!formData.imageFile}
              className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
            />

            {/* Файл */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
            />

            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                className="w-full h-40 object-cover rounded"
              />
            )}

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
            >
              {bannerTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <div className="flex gap-4">
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
              />
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
              />
            </div>

            <select
              name="device"
              value={formData.device}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
            >
              {devices.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <div className="flex gap-4">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
              />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded text-slate-100"
              />
            </div>

            <div className="flex justify-end">
              <button
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
              >
                {loading ? "Сохранение..." : "Создать баннер"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
