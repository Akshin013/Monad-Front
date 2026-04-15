// // "use client";
// // import Link from "next/link";
// // import { useEffect, useState } from "react";
// // import { useSearchParams } from "next/navigation";
// // import Breadcrumbs from "@/Components/Breadcrumbs";

// // const subtypeMap = {
// //   DEBIT_CARD: "Дебетовая карта",
// //   CREDIT_CARD: "Кредитная карта",
// // };

// // const Cards = () => {
// //   const [cards, setCards] = useState([]);
// //   const searchParams = useSearchParams();
// //   const initialTab = searchParams.get("tab") || "ALL";
// //   const [activeTab, setActiveTab] = useState(initialTab);

// //   useEffect(() => {
// //     const fetchCards = async () => {
// //       try {
// //         const res = await fetch(
// //           "http://localhost:5000/api/products?category=CARD"
// //         );
// //         const data = await res.json();
// //         setCards(data);
// //       } catch (err) {
// //         console.error(err);
// //       }
// //     };
// //     fetchCards();
// //   }, []);

// //   const filteredCards = cards.filter((card) => {
// //     if (activeTab === "ALL") return true;
// //     if (activeTab === "DEBIT") return card.subtype === "DEBIT_CARD";
// //     if (activeTab === "CREDIT") return card.subtype === "CREDIT_CARD";
// //   });

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#e1e6ed] px-4 py-10">
// //       <div className="bg-transparent px-4 mb-6">
// //         <Breadcrumbs
// //           items={[{ label: "Главная", href: "/" }, { label: "Карты" }]}
// //         />
// //       </div>

// //       <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
// //         Банковские карты
// //       </h1>

// //       {/* TABS */}
// //       <ul className="flex gap-6 justify-center mb-10 border-b border-gray-300">
// //         {[
// //           { key: "ALL", label: "Все карты" },
// //           { key: "DEBIT", label: "Дебетовые" },
// //           { key: "CREDIT", label: "Кредитные" },
// //         ].map((tab) => (
// //           <li
// //             key={tab.key}
// //             onClick={() => setActiveTab(tab.key)}
// //             className={`
// //               cursor-pointer
// //               pb-3
// //               text-sm md:text-base
// //               font-medium
// //               transition
// //               ${
// //                 activeTab === tab.key
// //                   ? "text-blue-600 border-b-2 border-blue-600"
// //                   : "text-gray-500 hover:text-blue-600"
// //               }
// //             `}
// //           >
// //             {tab.label}
// //           </li>
// //         ))}
// //       </ul>

// //       {/* CARDS */}
// //       <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-2">
// //         {filteredCards.map((card) => (
// //           <div
// //             key={card._id}
// //             className="
// //               bg-white
// //               rounded-2xl
// //               shadow-lg
// //               p-6 md:p-8
// //               flex
// //               gap-6 md:gap-8
// //               hover:scale-[1.02]
// //               transition
// //             "
// //           >
// //             {/* Левая часть — карта */}
// //             <div className="w-40 md:w-56 flex-shrink-0 flex items-center">
// //               <div className="w-full h-28 md:h-36 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-lg flex items-end p-3 md:p-4">
// //                 <span className="text-xs md:text-sm text-white font-semibold">
// //                   {card.card?.cardNetwork || "VISA"}
// //                 </span>
// //               </div>
// //             </div>

// //             {/* Правая часть */}
// //             <div className="flex flex-col justify-between text-gray-800 w-full">
// //               <div>
// //                 <p className="text-sm md:text-base text-gray-500">
// //                   {subtypeMap[card.subtype]}
// //                 </p>
// //                 <h2 className="text-lg md:text-2xl font-semibold">{card.title}</h2>
// //               </div>

// //               <div className="mt-3 space-y-1 text-sm md:text-base text-gray-600">
// //                 {card.subtype === "CREDIT_CARD" && (
// //                   <>
// //                     <p>
// //                       💳 Лимит:{" "}
// //                       <span className="font-semibold text-gray-800">
// //                         до {card.card?.creditLimit || 0} ₼
// //                       </span>
// //                     </p>
// //                     <p>
// //                       🎁 Кешбек:{" "}
// //                       <span className="font-semibold text-gray-800">
// //                         {card.card?.cashbackPercent || 0}%
// //                       </span>
// //                     </p>
// //                   </>
// //                 )}

// //                 <p>
// //                   📅 Обслуживание:{" "}
// //                   <span className="font-semibold text-gray-800">
// //                     {card.card?.freeService
// //                       ? "Бесплатно"
// //                       : `${card.card?.annualFee || 0} ₼ / год`}
// //                   </span>
// //                 </p>
// //               </div>

// //               <Link href={`/Cards/${card._id}`}>
// //                 <button className="mt-4 w-full bg-blue-600 hover:bg-blue-500 py-3 md:py-4 rounded-lg text-white font-semibold transition">
// //                   Подробнее
// //                 </button>
// //               </Link>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Cards;

// "use client";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";

// const subtypeMap = {
//   DEBIT_CARD: "Дебетовая карта",
//   CREDIT_CARD: "Кредитная карта",
// };

// const Cards = () => {
//   const [cards, setCards] = useState([]);

//   useEffect(() => {
//     const fetchCards = async () => {
//       try {
//         const res = await fetch(
//           "http://localhost:5000/api/products?category=CARD"
//         );
//         const data = await res.json();
//         setCards(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchCards();
//   }, []);

// const [activeTab, setActiveTab] = useState("ALL");

// const filteredCards = cards.filter(card => {
//   if (activeTab === "ALL") return true;
//   if (activeTab === "DEBIT") return card.subtype === "DEBIT_CARD";
//   if (activeTab === "CREDIT") return card.subtype === "CREDIT_CARD";
// });

//   return (
// <div className="min-h-screen bg-gradient-to-b from-[#050d1c] to-[#0b1f3a] px-4 py-10">
//   <h1 className="text-3xl font-bold text-white mb-6 text-center">
//     Банковские карты
//   </h1>

//   {/* TABS */}
//   <ul className="flex gap-6 justify-center mb-10 border-b border-slate-700">
//     {[
//       { key: "ALL", label: "Все карты" },
//       { key: "DEBIT", label: "Дебетовые" },
//       { key: "CREDIT", label: "Кредитные" },
//     ].map(tab => (
//       <li
//         key={tab.key}
//         onClick={() => setActiveTab(tab.key)}
//         className={`
//           cursor-pointer
//           pb-3
//           text-sm
//           font-medium
//           transition
//           ${
//             activeTab === tab.key
//               ? "text-white border-b-2 border-blue-500"
//               : "text-slate-400 hover:text-white"
//           }
//         `}
//       >
//         {tab.label}
//       </li>
//     ))}
//   </ul>

//   {/* CARDS */}
//   <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
//     {filteredCards.map((card) => (
//       <div
//         key={card._id}
//         className="
//           bg-[#08162c]
//           rounded-2xl
//           shadow-xl
//           p-5
//           flex
//           gap-4
//           hover:scale-[1.02]
//           transition
//         "
//       >
//         {/* Левая часть — карта */}
//         <div className="w-32 flex-shrink-0 flex items-center">
//           <div className="w-full h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-lg flex items-end p-2">
//             <span className="text-xs text-white font-semibold">
//               {card.card?.cardNetwork || "VISA"}
//             </span>
//           </div>
//         </div>

//         {/* Правая часть */}
//         <div className="flex flex-col justify-between text-white w-full">
//           <div>
//             <p className="text-sm text-slate-400">
//               {card.subtype === "DEBIT_CARD" ? "Дебетовая карта" : "Кредитная карта"}
//             </p>
//             <h2 className="text-lg font-semibold">
//               {card.title}
//             </h2>
//           </div>

//           <div className="mt-3 space-y-1 text-sm text-slate-300">
//             {card.subtype === "CREDIT_CARD" && (
//               <>
//                 <p>💳 Лимит: <span className="text-white">до {card.card?.creditLimit || 0} ₼</span></p>
//                 <p>🎁 Кешбек: <span className="text-white">{card.card?.cashbackPercent || 0}%</span></p>
//               </>
//             )}

//             <p>
//               📅 Обслуживание:{" "}
//               <span className="text-white">
//                 {card.card?.freeService
//                   ? "Бесплатно"
//                   : `${card.card?.annualFee || 0} ₼ / год`}
//               </span>
//             </p>
//           </div>

//           <Link href={`/Cards/${card._id}`}>
//             <button className="mt-4 w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg">
//               Подробнее
//             </button>
//           </Link>
//         </div>
//       </div>
//     ))}
//   </div>
// </div>

//   );
// };

// export default Cards;

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumbs from "../../Components/Breadcrumbs";

const Cards = () => {
  const [cards, setCards] = useState([]);
  const searchParams = useSearchParams();

  // Считываем tab из URL, по умолчанию ALL
  const initialTab = searchParams.get("tab") || "ALL";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?category=CARD`,
        );
        const data = await res.json();
        setCards(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCards();
  }, []);

  const toggleCompare = (cardId) => {
    let current = JSON.parse(localStorage.getItem("compareCards") || "[]");

    if (current.includes(cardId)) {
      current = current.filter((id) => id !== cardId);
    } else {
      current.push(cardId);
    }

    localStorage.setItem("compareCards", JSON.stringify(current));
    setSelected(current);
  };

  // Фильтруем карты по выбранной категории
  const filteredCards = cards.filter((card) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "DEBIT") return card.subtype === "DEBIT_CARD";
    if (activeTab === "CREDIT") return card.subtype === "CREDIT_CARD";
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d1c] to-[#0b1f3a] px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        Банковские карты
      </h1>

      <div className="  px-4 ">
        {/* Хлебные крошки */}
        <Breadcrumbs
          items={[{ label: "Главная", href: "/" }, { label: "Карты" }]}
        />
      </div>

      {/* TABS */}
      <ul className="flex flex-wrap gap-4 justify-center mb-10 border-b border-slate-700">
        {[
          { key: "ALL", label: "Все карты" },
          { key: "DEBIT", label: "Дебетовые" },
          { key: "CREDIT", label: "Кредитные" },
        ].map((tab) => (
          <li
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              cursor-pointer
              pb-3
              text-sm
              font-medium
              transition
              ${
                activeTab === tab.key
                  ? "text-white border-b-2 border-blue-500"
                  : "text-slate-400 hover:text-white"
              }
            `}
          >
            {tab.label}
          </li>
        ))}
      </ul>

      {/* CARDS */}
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {filteredCards.map((card) => (
          <div
            key={card._id}
            className="
              bg-[#08162c]
              rounded-2xl
              shadow-xl
              p-4 md:p-5
              flex flex-col sm:flex-row
              gap-4
              hover:scale-[1.01]
              transition
            "
          >
            {/* Левая часть — карта */}
            <div className="w-full sm:w-36 flex-shrink-0 flex items-center">
              <div className="w-full h-24 sm:h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-lg flex items-end p-2">
                <span className="text-xs text-white font-semibold">
                  {card.card?.cardNetwork || "VISA"}
                </span>
              </div>
            </div>

            {/* Правая часть */}
            <div className="flex flex-col justify-between text-white w-full">
              <div>
                <p className="text-sm text-slate-400">
                  {card.subtype === "DEBIT_CARD"
                    ? "Дебетовая карта"
                    : "Кредитная карта"}
                </p>
                <h2 className="text-lg font-semibold">{card.title}</h2>
              </div>

              <div className="mt-3 space-y-1 text-sm text-slate-300">
                {card.subtype === "CREDIT_CARD" && (
                  <>
                    <p>
                      💳 Лимит:{" "}
                      <span className="text-white">
                        до {card.card?.creditLimit || 0} ₼
                      </span>
                    </p>
                    <p>
                      🎁 Кешбек:{" "}
                      <span className="text-white">
                        {card.card?.cashbackPercent || 0}%
                      </span>
                    </p>
                  </>
                )}

                <p>
                  📅 Обслуживание:{" "}
                  <span className="text-white">
                    {card.card?.freeService
                      ? "Бесплатно"
                      : `${card.card?.annualFee || 0} ₼ / год`}
                  </span>
                </p>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Link href={`/Cards/${card._id}`} className="flex-[4]">
                  <button className="w-full px-4 py-1.5 bg-accent hover:bg-blue-500 rounded-lg text-sm">
                    Подробнее
                  </button>
                </Link>
                <button
                  onClick={() => toggleCompare(card._id)}
                  className="flex-[1] px-4 py-1.5 bg-primary-dark hover:bg-primary rounded-lg text-sm"
                >
                  Сравнить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
