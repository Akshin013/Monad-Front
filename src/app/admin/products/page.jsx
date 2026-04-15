"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import { useAuth } from "../../Context/AuthContext"; // Добавьте правильный путь к вашему AuthContext
import { useAuth } from "../../../hooks/useAuth.js"; // Добавьте правильный путь к вашему AuthContext

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    if (!token) return;
    
    setLoading(true);
    let query = [];
    if (filterCategory) query.push(`category=${filterCategory}`);
    if (filterStatus) query.push(`status=${filterStatus}`);
    if (search) query.push(`title=${search}`);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products?${query.join("&")}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Ошибка загрузки продуктов:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [filterCategory, filterStatus, search, token]);

  const handleDelete = async (id) => {
    if (!confirm("Удалить продукт?")) return;
    
    try {
      // Используем admin роут
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/${id}`, { 
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      if (res.ok) {
        fetchProducts();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Ошибка при удалении продукта");
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Ошибка при удалении продукта");
    }
  };

const handleSave = async (updatedProduct) => {
  try {
    // Создаем чистый объект для отправки, убираем служебные поля MongoDB
    const { _id, __v, createdAt, updatedAt, ...productData } = updatedProduct;
    
    console.log("Отправляемые данные:", productData); // Для отладки
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/${_id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(productData),
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log("Продукт обновлен:", data);
      setEditingProduct(null);
      fetchProducts();
    } else {
      const errorData = await res.json();
      console.error("Ошибка сервера:", errorData);
      alert(errorData.message || "Ошибка при сохранении изменений");
    }
  } catch (error) {
    console.error("Ошибка сохранения:", error);
    alert("Ошибка при сохранении изменений");
  }
};

  const getCategoryBadge = (category) => {
    const badges = {
      CARD: "bg-purple-100 text-purple-700",
      CREDIT: "bg-green-100 text-green-700",
      INSURANCE: "bg-blue-100 text-blue-700"
    };
    return badges[category] || "bg-gray-100 text-gray-700";
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: "bg-yellow-100 text-yellow-700",
      APPROVED: "bg-green-100 text-green-700",
      REJECTED: "bg-red-100 text-red-700"
    };
    return badges[status] || "bg-gray-100 text-gray-700";
  };

  if (!token) {
    return (
      <div className="p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-12 text-center">
            <p className="text-slate-400 text-lg">Необходима авторизация</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">  
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Продукты</h1>
          <p className="text-slate-400 text-sm md:text-base">Управление продуктами и услугами</p>
        </div>

        {/* Фильтры */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Категория
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full border border-slate-700 rounded-lg p-3 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-blue-500/30 transition-all"
              >
                <option value="">Все категории</option>
                <option value="CARD">Карты</option>
                <option value="CREDIT">Кредиты</option>
                <option value="INSURANCE">Страхование</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Статус
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-slate-700 rounded-lg p-3 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-blue-500/30 transition-all"
              >
                <option value="">Все статусы</option>
                <option value="PENDING">Ожидает</option>
                <option value="APPROVED">Одобрено</option>
                <option value="REJECTED">Отклонено</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Поиск
              </label>
              <input
                type="text"
                placeholder="Поиск по названию..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-slate-700 rounded-lg p-3 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Контент */}
        {loading ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-slate-400 mt-4">Загрузка...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-12 text-center">
            <p className="text-slate-400 text-lg">Продукты не найдены</p>
          </div>
        ) : (
          <>
            {/* Десктопная таблица */}
            <div className="hidden lg:block rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-slate-800">
                    <tr>
                      {["ID", "Название", "Категория", "Подтип", "Статус", "Активно", "Действия"].map(
                        (header) => (
                          <th
                            key={header}
                            className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-transparent divide-y divide-slate-800">
                    {products.map((p) => (
                      <tr
                        key={p._id}
                        className="hover:bg-slate-800/70 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                          {p._id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-100">{p.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryBadge(p.category)}`}>
                            {p.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {p.subtype}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(p.status)}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {p.is_active ? (
                            <span className="text-green-600 text-xl">✓</span>
                          ) : (
                            <span className="text-red-600 text-xl">✕</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-all duration-200 hover:shadow-lg text-xs"
                              onClick={() => setEditingProduct(p)}
                            >
                              ✏️
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-all duration-200 hover:shadow-lg text-xs"
                              onClick={() => handleDelete(p._id)}
                            >
                              🗑️
                            </button>
                            <Link
                              href={`/Admin/Products/${p._id}`}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 hover:shadow-lg inline-flex items-center text-xs"
                            >
                              👁️
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Мобильные карточки */}
            <div className="lg:hidden space-y-4">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {p.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono">
                        ID: {p._id.slice(-6)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.is_active ? (
                        <span className="text-green-600 text-xl">✓</span>
                      ) : (
                        <span className="text-red-600 text-xl">✕</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(p.category)}`}>
                        {p.category}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Подтип:</span> {p.subtype}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4  rounded-lg transition-all duration-200 text-sm font-medium"
                      onClick={() => setEditingProduct(p)}
                    >
                      ✏️ 
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                      onClick={() => handleDelete(p._id)}
                    >
                      🗑️
                    </button>
                    <Link
                      href={`/Admin/Products/${p._id}`}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium inline-flex items-center"
                    >
                      👁️
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
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
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-auto w-full max-w-4xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-4 md:p-6 rounded-t-2xl sticky top-0 z-10">
          <h2 className="text-xl md:text-2xl font-bold text-white">✏️ Редактировать продукт</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
          {/* Основные поля */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm md:text-base">Название</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm md:text-base">Описание</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows="3"
                className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm md:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm md:text-base">Категория</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
              >
                <option value="CARD">Карты</option>
                <option value="CREDIT">Кредиты</option>
                <option value="INSURANCE">Страхование</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm md:text-base">Подтип</label>
              <input
                type="text"
                name="subtype"
                value={formData.subtype}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm md:text-base">Статус</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
              >
                <option value="PENDING">Ожидает</option>
                <option value="APPROVED">Одобрено</option>
                <option value="REJECTED">Отклонено</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all w-full">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="font-semibold text-gray-700 text-sm md:text-base">Активно</span>
              </label>
            </div>
          </div>

          {/* Credit секция */}
          {formData.category === "CREDIT" && formData.credit && (
            <div className="border-2 border-green-200 p-4 md:p-6 rounded-xl bg-green-50">
              <h3 className="font-bold text-base md:text-lg mb-4 text-green-800 flex items-center gap-2">
                💳 Параметры кредита
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { field: "minAmount", label: "Мин. сумма" },
                  { field: "maxAmount", label: "Макс. сумма" },
                  { field: "interestRateFrom", label: "Ставка от %" },
                  { field: "interestRateTo", label: "Ставка до %" }
                ].map(({ field, label }) => (
                  <div key={field}>
                    <label className="block mb-2 font-medium text-gray-700 text-sm">{label}</label>
                    <input
                      type="number"
                      placeholder={label}
                      value={formData.credit[field] || ""}
                      onChange={(e) => handleNestedChange("credit", field, e.target.value)}
                      className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm md:text-base"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card секция */}
          {formData.category === "CARD" && formData.card && (
            <div className="border-2 border-purple-200 p-4 md:p-6 rounded-xl bg-purple-50">
              <h3 className="font-bold text-base md:text-lg mb-4 text-purple-800 flex items-center gap-2">
                💳 Параметры карты
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { field: "creditLimit", label: "Кредитный лимит" },
                  { field: "cashbackPercent", label: "Кэшбэк %" },
                  { field: "annualFee", label: "Годовое обслуживание" }
                ].map(({ field, label }) => (
                  <div key={field}>
                    <label className="block mb-2 font-medium text-gray-700 text-sm">{label}</label>
                    <input
                      type="number"
                      placeholder={label}
                      value={formData.card[field] || ""}
                      onChange={(e) => handleNestedChange("card", field, e.target.value)}
                      className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm md:text-base"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white pb-2">
            <button
              type="button"
              className="bg-gray-500 hover: bg-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg font-semibold order-2 sm:order-1"
              onClick={onClose}
            >
              ✕ Отмена
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg font-semibold order-1 sm:order-2"
            >
              ✓ Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}