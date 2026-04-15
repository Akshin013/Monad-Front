"use client";
import { useEffect, useState } from "react";
import Breadcrumbs from "../../../Components/Breadcrumbs";

const subtypeMap = {
  DEBIT_CARD: "Дебетовая карта",
  CREDIT_CARD: "Кредитная карта",
};

const CardsCompare = () => {
  const [cards, setCards] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [selected, setSelected] = useState([]); // выбранные карты для сравнения

  useEffect(() => {
    const loadCards = async () => {
      const ids = JSON.parse(localStorage.getItem("compareCards") || "[]");
      if (!ids.length) return setCards([]);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?category=CARD`
        );
        const data = await res.json();
        setCards(data.filter((card) => ids.includes(card._id)));
      } catch (e) {
        console.error(e);
      }
    };
    loadCards();
  }, []);


  // Фильтруем карты по категории
  const filteredCards = cards.filter(card => {
    if (activeTab === "ALL") return true;
    if (activeTab === "DEBIT") return card.subtype === "DEBIT_CARD";
    if (activeTab === "CREDIT") return card.subtype === "CREDIT_CARD";
  });

  const toggleSelect = (cardId) => {
    setSelected(prev =>
      prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
    );
  };

  const selectedCards = cards.filter(card => selected.includes(card._id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d1c] to-[#0b1f3a] px-4 py-10">
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Карты" }, { label: "Сравнение" }]} />

      <h1 className="text-3xl font-bold text-white mb-6 text-center">Сравнение карт</h1>

      {/* TABS */}
      <ul className="flex gap-6 justify-center mb-6 border-b border-slate-700">
        {[
          { key: "ALL", label: "Все карты" },
          { key: "DEBIT", label: "Дебетовые" },
          { key: "CREDIT", label: "Кредитные" },
        ].map(tab => (
          <li
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`cursor-pointer pb-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? "text-white border-b-2 border-blue-500"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </li>
        ))}
      </ul>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Список карт для выбора */}
        <div className="lg:w-1/3 space-y-3 max-h-[70vh] overflow-y-auto">
          {filteredCards.map(card => (
            <div
              key={card._id}
              className="flex justify-between items-center bg-[#08162c] p-3 rounded-xl shadow hover:scale-[1.02] transition cursor-pointer"
              onClick={() => toggleSelect(card._id)}
            >
              <div>
                <p className="text-sm text-slate-400">{subtypeMap[card.subtype]}</p>
                <h2 className="text-lg text-white font-semibold">{card.title}</h2>
              </div>
              <input
                type="checkbox"
                checked={selected.includes(card._id)}
                readOnly
                className="w-5 h-5 accent-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Сравнительная таблица */}
        <div className="lg:w-2/3 overflow-x-auto rounded-xl border border-slate-800">
          {selectedCards.length === 0 ? (
            <p className="text-white text-center mt-10">Выберите карты для сравнения</p>
          ) : (
            <table className="min-w-full border-collapse border border-slate-700 text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-slate-700 p-2">Параметр</th>
                  {selectedCards.map(card => (
                    <th key={card._id} className="border border-slate-700 p-2 text-center">
                      {card.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-white">
                <tr className="bg-[#08162c]">
                  <td className="border border-slate-700 p-2 font-semibold">Тип карты</td>
                  {selectedCards.map(card => (
                    <td key={card._id} className="border border-slate-700 p-2 text-center">
                      {subtypeMap[card.subtype]}
                    </td>
                  ))}
                </tr>
                <tr className="bg-[#0b1f3a]">
                  <td className="border border-slate-700 p-2 font-semibold">Лимит</td>
                  {selectedCards.map(card => (
                    <td key={card._id} className="border border-slate-700 p-2 text-center">
                      {card.card?.creditLimit ? `${card.card.creditLimit} ₼` : "-"}
                    </td>
                  ))}
                </tr>
                <tr className="bg-[#08162c]">
                  <td className="border border-slate-700 p-2 font-semibold">Кешбек</td>
                  {selectedCards.map(card => (
                    <td key={card._id} className="border border-slate-700 p-2 text-center">
                      {card.card?.cashbackPercent ? `${card.card.cashbackPercent}%` : "-"}
                    </td>
                  ))}
                </tr>
                <tr className="bg-[#0b1f3a]">
                  <td className="border border-slate-700 p-2 font-semibold">Обслуживание</td>
                  {selectedCards.map(card => (
                    <td key={card._id} className="border border-slate-700 p-2 text-center">
                      {card.card?.freeService ? "Бесплатно" : `${card.card?.annualFee || 0} ₼ / год`}
                    </td>
                  ))}
                </tr>
                <tr className="bg-[#08162c]">
                  <td className="border border-slate-700 p-2 font-semibold">Сеть карты</td>
                  {selectedCards.map(card => (
                    <td key={card._id} className="border border-slate-700 p-2 text-center">
                      {card.card?.cardNetwork || "-"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardsCompare;
