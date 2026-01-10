"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    alert("Сохранено!");
  };

  if (loading) return <p>Загрузка...</p>;
  if (!product) return <p>Продукт не найден</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1">Название</label>
          <input
            className="border p-2 rounded w-full"
            value={product.title}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1">Описание</label>
          <textarea
            className="border p-2 rounded w-full"
            value={product.description || ""}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />
        </div>

        <div className="flex gap-4">
          <div>
            <label>Категория</label>
            <select
              className="border p-2 rounded"
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
            >
              <option value="CARD">Карты</option>
              <option value="CREDIT">Кредиты</option>
              <option value="INSURANCE">Страхование</option>
            </select>
          </div>

          <div>
            <label>Подтип</label>
            <input
              className="border p-2 rounded"
              value={product.subtype}
              onChange={(e) =>
                setProduct({ ...product, subtype: e.target.value })
              }
            />
          </div>

          <div>
            <label>Статус</label>
            <select
              className="border p-2 rounded"
              value={product.status}
              onChange={(e) =>
                setProduct({ ...product, status: e.target.value })
              }
            >
              <option value="PENDING">Ожидает</option>
              <option value="APPROVED">Одобрено</option>
              <option value="REJECTED">Отклонено</option>
            </select>
          </div>

          <div className="flex items-center gap-2 mt-6">
            <label>Активно</label>
            <input
              type="checkbox"
              checked={product.is_active}
              onChange={(e) =>
                setProduct({ ...product, is_active: e.target.checked })
              }
            />
          </div>
        </div>

        {/* Credit / Card fields */}
        {product.category === "CREDIT" && product.credit && (
          <div className="border p-2 rounded">
            <h3 className="font-bold mb-2">Поля кредита</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="minAmount"
                value={product.credit.minAmount || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    credit: { ...product.credit, minAmount: e.target.value },
                  })
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="maxAmount"
                value={product.credit.maxAmount || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    credit: { ...product.credit, maxAmount: e.target.value },
                  })
                }
                className="border p-2 rounded"
              />
            </div>
          </div>
        )}

        {product.category === "CARD" && product.card && (
          <div className="border p-2 rounded">
            <h3 className="font-bold mb-2">Поля карты</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="creditLimit"
                value={product.card.creditLimit || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    card: { ...product.card, creditLimit: e.target.value },
                  })
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="cashbackPercent"
                value={product.card.cashbackPercent || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    card: { ...product.card, cashbackPercent: e.target.value },
                  })
                }
                className="border p-2 rounded"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Сохранить
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => router.back()}
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  );
}
