"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    let query = [];
    if (filterCategory) query.push(`category=${filterCategory}`);
    if (filterStatus) query.push(`status=${filterStatus}`);
    if (search) query.push(`title=${search}`);
    const res = await fetch(`http://localhost:5000/api/products?${query.join("&")}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [filterCategory, filterStatus, search]);

  const handleDelete = async (id) => {
    if (!confirm("Удалить продукт?")) return;
    await fetch(`/http://localhost:5000/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const handleSave = async (updatedProduct) => {
    await fetch(`/http://localhost:5000/api/products/${updatedProduct._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });
    setEditingProduct(null);
    fetchProducts();
  };

  return (
    <div className="p-6 bg-blue-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Продукты</h1>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border rounded-lg p-2 bg-blue-900 shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Все категории</option>
          <option value="CARD">Карты</option>
          <option value="CREDIT">Кредиты</option>
          <option value="INSURANCE">Страхование</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg p-2 bg-blue-900 shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Все статусы</option>
          <option value="PENDING">Ожидает</option>
          <option value="APPROVED">Одобрено</option>
          <option value="REJECTED">Отклонено</option>
        </select>

        <input
          type="text"
          placeholder="Поиск по названию"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 flex-1 shadow-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Таблица */}
      {loading ? (
        <p className="text-gray-500">Загрузка...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-blue-50">
              <tr>
                {["ID", "Название", "Категория", "Подтип", "Статус", "Активно", "Действия"].map(
                  (header) => (
                    <th
                      key={header}
                      className="text-left px-4 py-2 text-gray-700 font-medium border-b"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr
                  key={p._id}
                  className={i % 2 === 0 ? "bg-gray-100" : "bg-gray-300 hover:bg-gray-100"}
                >
                  <td className="px-4 py-2 text-sm text-blue-700">{p._id}</td>
                  <td className="px-4 py-2 text-blue-700">{p.category}</td>
                  <td className="px-4 py-2 text-blue-700">{p.title}</td>
                  <td className="px-4 py-2 text-blue-700">{p.subtype}</td>
                  <td className="px-4 py-2 text-blue-700">{p.status}</td>
                  <td className="px-4 py-2 text-blue-700">{p.is_active ? "Да" : "Нет"}</td>
                  <td className="px-4 py-2 text-blue-700 flex gap-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                      onClick={() => setEditingProduct(p)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                      onClick={() => handleDelete(p._id)}
                    >
                      Удалить
                    </button>
                    <Link
                      href={`/admin/products/${p._id}`}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition"
                    >
                      Детали
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Модальное редактирование */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// --------------------- Модальное окно редактирования ---------------------

function EditProductModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...product });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-blue-900 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-blue-900 p-6 rounded-xl shadow-2xl max-h-[90vh] overflow-auto w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Редактировать продукт</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основные поля */}
          <div className="grid gap-4 md:grid-cols-2" >
            <div>
              <label className="block mb-1 font-medium  text-gray-700">Название</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium  text-gray-700">Описание</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <label className="font-medium text-gray-700">Категория</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-400"
              >
                <option value="CARD">Карты</option>
                <option value="CREDIT">Кредиты</option>
                <option value="INSURANCE">Страхование</option>
              </select>
            </div>
            <div>
              <label className="font-medium text-gray-700">Подтип</label>
              <input
                type="text"
                name="subtype"
                value={formData.subtype}
                onChange={handleChange}
                className="border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="font-medium text-gray-700">Статус</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-400"
              >
                <option value="PENDING">Ожидает</option>
                <option value="APPROVED">Одобрено</option>
                <option value="REJECTED">Отклонено</option>
              </select>
            </div>
            <div className="flex items-center mt-6 gap-2">
              <label className="font-medium text-gray-700">Активно</label>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5"
              />
            </div>
          </div>

          {/* Credit / Card секция */}
          {formData.category === "CREDIT" && formData.credit && (
            <div className="border p-4 rounded-lg bg-blue-50">
              <h3 className="font-semibold mb-2 text-gray-700">Поля кредита</h3>
              <div className="grid grid-cols-2 gap-3">
                {["minAmount", "maxAmount", "interestRateFrom", "interestRateTo"].map((field) => (
                  <input
                    key={field}
                    type="number"
                    placeholder={field}
                    value={formData.credit[field] || ""}
                    onChange={(e) => handleNestedChange("credit", field, e.target.value)}
                    className="border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                  />
                ))}
              </div>
            </div>
          )}

          {formData.category === "CARD" && formData.card && (
            <div className="border p-4 rounded-lg   ">
              <h3 className="font-semibold mb-2 text-gray-700">Поля карты</h3>
              <div className="grid grid-cols-2 gap-3">
                {["creditLimit", "cashbackPercent", "annualFee"].map((field) => (
                  <input
                    key={field}
                    type="number"
                    placeholder={field}
                    value={formData.card[field] || ""}
                    onChange={(e) => handleNestedChange("card", field, e.target.value)}
                    className="border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-green-400"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg transition"
              onClick={onClose}
            >
              Закрыть
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
