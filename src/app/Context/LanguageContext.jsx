"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const translations = {
  ru: {
    credits: {
      home: "Главная",
      credits: "Кредиты",
      consumerLabel: "Потребительский кредит",
      consumerDesc: "Краткосрочные кредиты на любые нужды.",
      autoLabel: "Автокредит",
      autoDesc: "Кредиты для покупки автомобиля с удобными условиями.",
      mortgageLabel: "Ипотека",
      mortgageDesc: "Долгосрочные кредиты на покупку жилья.",
      securedLabel: "Кредит под залог",
      securedDesc: "Кредиты под залог недвижимости или имущества.",
      apply: "Подать заявку",
      details: "Подробнее",
    },
  },
  en: {
    credits: {
      home: "Home",
      credits: "Credits",
      consumerLabel: "Consumer loan",
      consumerDesc: "Short-term loans for any needs.",
      autoLabel: "Auto loan",
      autoDesc: "Loans for car purchase with comfortable conditions.",
      mortgageLabel: "Mortgage",
      mortgageDesc: "Long-term loans for housing purchase.",
      securedLabel: "Secured loan",
      securedDesc: "Loans secured by real estate or property.",
      apply: "Apply",
      details: "Details",
    },
  },
  az: {
    credits: {
      home: "Ana səhifə",
      credits: "Kreditlər",
      consumerLabel: "İstehlak krediti",
      consumerDesc: "Qısa müddətli istənilən ehtiyac üçün kreditlər.",
      autoLabel: "Avtokredit",
      autoDesc: "Avtomobil alışı üçün rahat şərtlərlə kreditlər.",
      mortgageLabel: "İpoteka",
      mortgageDesc: "Mənzil alışı üçün uzunmüddətli kreditlər.",
      securedLabel: "Zaminli kredit",
      securedDesc: "Əmlak və ya mal-zamin ilə təmin edilmiş kreditlər.",
      apply: "Müraciət et",
      details: "Ətraflı",
    },
  },
};


export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("ru");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  const translate = (namespace) => {
    return translations[lang][namespace] || {};
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Хук для перевода
export const useTranslate = (namespace) => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslate must be used inside LanguageProvider");
  return ctx.translate(namespace);
};

// Хук для смены языка
export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return { lang: ctx.lang, changeLanguage: ctx.changeLanguage };
};

export { LanguageContext };
