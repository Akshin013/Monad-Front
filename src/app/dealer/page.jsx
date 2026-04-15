"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const DealerProfile = ({ slug }) => {
  const [dealer, setDealer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({});
  const [productForm, setProductForm] = useState({});
  const [editingProductId, setEditingProductId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  /* ==========================
     Загрузка профиля и п родуктов
  ========================== */
  const fetchDealer = async () => {
    try {
      let dealerData;
      if (token) {
        // Попробуем загрузить профиль владельца
        const { data } = await axios.get("/api/dealers/me", { headers });
        if (data.slug === slug) {
          dealerData = data;
          setIsOwner(true);
        }
      }

      if (!dealerData) {
        // Публичный профиль
        const { data } = await axios.get(`/api/dealers/${slug}`);
        dealerData = data;
      }

      setDealer(dealerData);
      setProfileForm({
        name: dealerData.name || "",
        description: dealerData.description || "",
        address: dealerData.address || "",
        phone: dealerData.contacts?.phone || "",
        email: dealerData.contacts?.email || "",
        workingHours: dealerData.workingHours || "",
        workingDays: dealerData.workingDays || "",
      });
    } catch (err) {
      console.error(err);
      alert("Ошибка загрузки профиля");
    }
  };

  const fetchProducts = async () => {
    try {
      let url = isOwner ? "/api/products/my" : `/api/products?provider=${dealer?._id}`;
      const { data } = await axios.get(url, { headers });
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert("Ошибка загрузки продуктов");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchDealer();
      await fetchProducts();
      setLoading(false);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, isOwner]);

  /* ==========================
     Обновление профиля
  ========================== */
  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      const { data } = await axios.put("/api/dealers/me", profileForm, { headers });
      setDealer(data);
      alert("Профиль обновлен");
    } catch (err) {
      console.error(err);
      alert("Ошибка обновления профиля");
    }
  };

  /* ==========================
     Работа с продуктами
  ========================== */
  const handleProductChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const saveProduct = async () => {
    try {
      if (!isOwner) return;
      if (editingProductId) {
        await axios.put(`/api/products/${editingProductId}`, productForm, { headers });
        setEditingProductId(null);
      } else {
        await axios.post("/api/products", productForm, { headers });
      }
      setProductForm({});
      fetchProducts();
      alert("Продукт сохранен и ожидает одобрения");
    } catch (err) {
      console.error(err);
      alert("Ошибка сохранения продукта");
    }
  };

  const editProduct = (product) => {
    setProductForm({
      title: product.title,
      category: product.category,
      subtype: product.subtype,
      description: product.description,
      currency: product.currency,
      credit: product.credit || {},
      card: product.card || {},
      dealerCommission: product.dealerCommission || 0,
    });
    setEditingProductId(product._id);
  };

  const deleteProduct = async (id) => {
    if (!isOwner) return;
    if (!confirm("Удалить продукт?")) return;
    try {
      await axios.delete(`/api/products/${id}`, { headers });
      fetchProducts();
      alert("Продукт удалён");
    } catch (err) {
      console.error(err);
      alert("Ошибка удаления продукта");
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!dealer) return <div>Дилер не найден</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">{dealer.name}</h1>
      <p>{dealer.description}</p>
      <p>Адрес: {dealer.address}</p>
      <p>Телефон: {dealer.contacts?.phone}</p>
      <p>Email: {dealer.contacts?.email}</p>
      <p>Часы работы: {dealer.workingHours} ({dealer.workingDays})</p>

      {isOwner && (
        <>
          {/* ====== Редактирование профиля ====== */}
          <div className="border p-4 rounded space-y-4 mt-6">
            <h2 className="text-xl font-semibold">Редактировать профиль</h2>
            <input
              type="text"
              name="name"
              placeholder="Название компании"
              value={profileForm.name}
              onChange={handleProfileChange}
              className="border p-2 w-full"
            />
            <textarea
              name="description"
              placeholder="Описание"
              value={profileForm.description}
              onChange={handleProfileChange}
              className="border p-2 w-full"
            />
            <input
              type="text"
              name="address"
              placeholder="Адрес"
              value={profileForm.address}
              onChange={handleProfileChange}
              className="border p-2 w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Телефон"
              value={profileForm.phone}
              onChange={handleProfileChange}
              className="border p-2 w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={profileForm.email}
              onChange={handleProfileChange}
              className="border p-2 w-full"
            />
            <input
              type="text"
              name="workingHours"
              placeholder="Часы работы"
              value={profileForm.workingHours}
              onChange={handleProfileChange}
              className="border p-2 w-full"
            />
            <input
              type="text"
              name="workingDays"
              placeholder="Дни работы"
              value={profileForm.workingDays}
              onChange={handleProfileChange}
              className="border p-2 w-full"
            />
            <button onClick={saveProfile} className="bg-blue-500 text-white px-4 py-2 rounded">
              Сохранить профиль
            </button>
          </div>

          {/* ====== Продукты ====== */}
          <div className="border p-4 rounded space-y-4 mt-6">
            <h2 className="text-xl font-semibold">Мои продукты</h2>

            {products.map((p) => (
              <div key={p._id} className="border p-2 rounded flex justify-between items-center">
                <div>
                  <strong>{p.title}</strong> ({p.category}/{p.subtype}) - {p.currency}
                </div>
                <div className="space-x-2">
                  <button onClick={() => editProduct(p)} className="bg-yellow-400 px-2 py-1 rounded">Редактировать</button>
                  <button onClick={() => deleteProduct(p._id)} className="bg-red-500 px-2 py-1 rounded text-white">Удалить</button>
                </div>
              </div>
            ))}

            {/* Форма добавления / редактирования продукта */}
            <div className="mt-4 border-t pt-4 space-y-2">
              <h3 className="font-semibold">{editingProductId ? "Редактировать продукт" : "Добавить продукт"}</h3>
              <input
                type="text"
                name="title"
                placeholder="Название продукта"
                value={productForm.title || ""}
                onChange={handleProductChange}
                className="border p-2 w-full"
              />
              <select name="category" value={productForm.category || "CREDIT"} onChange={handleProductChange} className="border p-2 w-full">
                <option value="CREDIT">Кредит</option>
                <option value="CARD">Карта</option>
                <option value="INSURANCE">Страховка</option>
              </select>
              <select name="subtype" value={productForm.subtype || "CONSUMER_LOAN"} onChange={handleProductChange} className="border p-2 w-full">
                <option value="CONSUMER_LOAN">Потребительский</option>
                <option value="AUTO_LOAN">Автокредит</option>
                <option value="MORTGAGE">Ипотека</option>
                <option value="DEBIT_CARD">Дебетовая карта</option>
                <option value="CREDIT_CARD">Кредитная карта</option>
                <option value="AUTO_INSURANCE">Автостраховка</option>
                <option value="PROPERTY_INSURANCE">Страховка имущества</option>
                <option value="LIFE_INSURANCE">Страховка жизни</option>
              </select>
              <textarea
                name="description"
                placeholder="Описание продукта"
                value={productForm.description || ""}
                onChange={handleProductChange}
                className="border p-2 w-full"
              />
              <select name="currency" value={productForm.currency || "AZN"} onChange={handleProductChange} className="border p-2 w-full">
                <option value="AZN">AZN</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <button onClick={saveProduct} className="bg-green-500 text-white px-4 py-2 rounded">
                {editingProductId ? "Сохранить изменения" : "Добавить продукт"}
              </button>
            </div>
          </div>
        </>
      )}

      {!isOwner && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Продукты дилера</h2>
          {products.length ? (
            products.map((p) => (
              <div key={p._id} className="border p-2 rounded mb-2">
                <strong>{p.title}</strong> ({p.category}/{p.subtype}) - {p.currency}
                <p>{p.description}</p>
              </div>
            ))
          ) : (
            <p>Нет продуктов</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DealerProfile;
