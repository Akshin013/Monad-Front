"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import useProductView from "../../../hooks/useProductView";
import useProductClick from "../../../hooks/useProductClick";

const subtypeMap = {
  DEBIT_CARD: "Дебетовая карта",
  CREDIT_CARD: "Кредитная карта",
  CONSUMER_LOAN: "Потребительский кредит",
  AUTO_LOAN: "Автокредит",
  MORTGAGE: "Ипотека",
  SECURED_LOAN: "Кредит под залог",
  BUSINESS_LOAN: "Бизнес-кредит",
  REFINEANCE: "Рефинансирование",
  AUTO_INSURANCE: "Автострахование",
  PROPERTY_INSURANCE: "Страхование имущества",
  LIFE_INSURANCE: "Страхование жизни",
};

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useProductView(id);
    const sendClick = useProductClick(id);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить данные продукта");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#e1e6ed] flex items-center justify-center text-gray-800">
        Загрузка...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-center text-gray-800 p-4">
        <p className="text-red-500 text-lg mb-4">
          {error || "Продукт не найден"}
        </p>
      </div>
    );
  }

  const isCard = ["DEBIT_CARD", "CREDIT_CARD"].includes(product.subtype);
  const isCredit = product.subtype.includes("LOAN");
  const isInsurance = product.subtype.includes("INSURANCE");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#e1e6ed] px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Хлебные крошки */}
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Продукты", href: "/Products" },
            { label: subtypeMap[product.subtype] || "Продукт" },
          ]}
        />

        {/* Логотип и название банка/страховой */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white p-6 rounded-xl shadow-lg">
          {product.dealer?.logo?.url && (
            <img
              src={product.dealer.logo.url}
              alt={product.dealer.name}
              className="w-32 h-32 object-contain rounded-xl shadow-md"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">
              {product.title}
            </h1>
            <p className="text-gray-500 mt-1">{subtypeMap[product.subtype]}</p>
            <p className="text-sm text-gray-400 mt-2">
              Банк / страховая: {product.dealer?.name || "—"}
            </p>
          </div>
        </div>

        {/* Основная информация */}
        {isCard && (
          <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-xl shadow-lg">
            {/* Визуал карты */}
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-sm h-56 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 shadow-2xl p-6 text-white flex flex-col justify-between">
                <div className="flex justify-between text-sm opacity-80">
                  <span>{product.card?.cardNetwork || "VISA"}</span>
                  <span>{subtypeMap[product.subtype]}</span>
                </div>
                <div className="tracking-widest text-lg">
                  •••• •••• •••• 4829
                </div>
                <div className="flex justify-between text-sm">
                  <span>{product.title}</span>
                  <span>12/28</span>
                </div>
              </div>
            </div>

            {/* Характеристики карты */}
            <div className="md:w-1/2 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {product.subtype === "CREDIT_CARD" && (
                  <>
                    <Info label="Кредитный лимит">
                      {product.card?.creditLimit || 0} ₼
                    </Info>
                    <Info label="Льготный период">
                      {product.card?.gracePeriod || 0} дней
                    </Info>
                    <Info label="Процентная ставка">
                      {product.card?.interestRate || 0} %
                    </Info>
                    <Info label="Годовое обслуживание">
                      {product.card?.annualFee || 0} ₼
                    </Info>
                  </>
                )}
                {product.subtype === "DEBIT_CARD" && (
                  <>
                    <Info label="Обслуживание">
                      {product.card?.freeService ? "Бесплатно" : "Платно"}
                    </Info>
                    <Info label="Cashback">
                      {product.card?.cashback || 0} %
                    </Info>
                    <Info label="Срок действия">
                      {product.card?.term || "—"} лет
                    </Info>
                    <Info label="Валюта">{product.currency}</Info>
                  </>
                )}
              </div>

              {/* Кнопки
              <div className="mt-6 flex flex-col md:flex-row gap-3">
                <button className="w-full md:w-1/2 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-sm font-semibold transition">
                  {product.subtype === "CREDIT_CARD" ? "Оформить кредит" : "Заказать карту"}
                </button> */}
              <a
                href={product.card.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={sendClick}
                className="bg-gradient-to-br from-blue-600 to-indigo-800 py-2 px-4 rounded-xl text-white font-semibold transition"
              >
                Перейти на сайт карты
              </a>
            </div>
          </div>
          // </div>
        )}

        {/* Кредиты */}
        {isCredit && (
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <h2 className="text-xl font-bold">Параметры кредита</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info label="Сумма">
                {product.credit?.minAmount || 0} -{" "}
                {product.credit?.maxAmount || 0} ₼
              </Info>
              <Info label="Ставка">
                {product.credit?.interestRateFrom || 0}% -{" "}
                {product.credit?.interestRateTo || 0}%
              </Info>
              <Info label="Срок">
                {product.credit?.minTerm || 0} - {product.credit?.maxTerm || 0}{" "}
                мес
              </Info>
              <Info label="Первоначальный взнос">
                {product.credit?.initialPayment || 0} ₼
              </Info>
            </div>
            <a
              href={product.card.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={sendClick}
              className="bg-gradient-to-br from-blue-600 to-indigo-800 py-2 px-4 rounded-xl text-white font-semibold transition"
            >
              Перейти на сайт карты
            </a>
          </div>
        )}

        {/* Страховки */}
        {isInsurance && (
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <h2 className="text-xl font-bold">Информация о страховке</h2>
            {product.insurance?.shortDescription && (
              <p>{product.insurance.shortDescription}</p>
            )}
            {product.insurance?.websiteUrl && (
              <a
                href={product.card.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={sendClick}
                className="bg-gradient-to-br from-blue-600 to-indigo-800py-2 px-4 rounded-xl text-white font-semibold transition"
              >
                Перейти на сайт карты
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* 🔹 Вспомогательный блок */
function Info({ label, children }) {
  return (
    <div>
      <div className="text-lg font-semibold text-gray-800">{children}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}
