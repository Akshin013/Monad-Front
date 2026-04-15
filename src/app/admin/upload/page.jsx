"use client";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Выберите файл");

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUrl(data.url);
    } catch (err) {
      console.error(err);
      alert("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-slate-100">
      <h2 className="text-2xl font-bold mb-4">Загрузка картинки</h2>
      <input type="file" onChange={handleFileChange} className="mb-4 text-sm text-slate-300"/>
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-500"
      >
        {loading ? "Загрузка..." : "Загрузить"}
      </button>

      {url && (
        <div className="mt-4">
          <p className="text-slate-300">Картинка загружена:</p>
          <img src={url} alt="Uploaded" className="mt-2 max-w-full"/>
        </div>
      )}
    </div>
  );
}
