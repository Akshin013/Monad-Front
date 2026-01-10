"use client";
import { useState } from "react";
import { apiRequest } from "@/Services/api.js"; // твой метод для fetch
import { useAuth } from "@/app/Context/AuthContext";

export default function RegisterAdmin() {
  const { user } = useAuth(); // текущий залогиненный админ
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secretKey: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const data = await apiRequest("/admins/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      setMessage(data.message);
    } catch (err) {
      setMessage(err.message || "Ошибка регистрации");
    }
  };

  if (!user || user.role !== "ADMIN") return <p>Доступ запрещён</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Регистрация нового админа</h2>
        {message && <p className="mb-4 text-red-600">{message}</p>}
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded mb-2"/>
        <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded mb-2"/>
        <input type="text" name="secretKey" placeholder="Секретный ключ" value={formData.secretKey} onChange={handleChange} required className="w-full p-2 border rounded mb-4"/>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">Зарегистрировать</button>
      </form>
    </div>
  );
}
