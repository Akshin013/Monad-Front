"use client";

import Link from "next/link";
import Breadcrumbs from "../../Components/Breadcrumbs";

const CREDIT_CATEGORIES = [
  {
    subtype: "Consumer",
    label: "Nağd Kredit",
    description:
      "Gündəlik ehtiyaclar üçün sürətli və rahat nağd kredit həlləri.",
    applyUrl: "/Apply/Consumer-loan",
    details: {
      amount: "1 000 – 50 000 ₼",
      term: "3 – 60 ay",
      rate: "12% – 24%",
      conditions: "Şəxsiyyət vəsiqəsi, gəlir sənədi",
    },
  },
  {
    subtype: "Auto",
    label: "Avtokredit",
    description:
      "Yeni və ya işlənmiş avtomobil almaq üçün sərfəli kredit şərtləri.",
    applyUrl: "/Apply/Auto-loan",
    details: {
      amount: "5 000 – 100 000 ₼",
      term: "12 – 72 ay",
      rate: "10% – 18%",
      conditions: "Avtomobil girovu, ilkin ödəniş",
    },
  },
  {
    subtype: "Mortgage",
    label: "İpoteka Krediti",
    description:
      "Arzuladığınız mənzili almaq üçün uzunmüddətli maliyyə dəstəyi.",
    applyUrl: "/Apply/Mortgage",
    details: {
      amount: "20 000 – 500 000 ₼",
      term: "5 – 25 il",
      rate: "6% – 12%",
      conditions: "Daşınmaz əmlak girovu",
    },
  },
  {
    subtype: "SecuredLoan",
    label: "Girovlu Kredit",
    description:
      "Daşınmaz əmlak və ya əmlak girovu ilə yüksək məbləğli kreditlər.",
    applyUrl: "/Apply/Secured-loan",
    details: {
      amount: "10 000 – 300 000 ₼",
      term: "12 – 120 ay",
      rate: "9% – 16%",
      conditions: "Girov, qiymətləndirmə sənədi",
    },
  },
];


export default function CreditsCategoryGrid() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050f2e] via-[#071b44] to-[#050f2e] py-14 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
          <Breadcrumbs
            items={[
              { label: "Əsas səhifə", href: "/" },
              { label: "Kreditlər" },
            ]}
          />
        </div>

        {/* Header */}
        <div className="text-center mt-8 mb-14">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Kreditlər
          </h1>
          <p className="text-blue-200 max-w-3xl mx-auto">
            Bankların ən sərfəli kredit təkliflərini müqayisə edin və sizə uyğun
            olan maliyyə həllini seçin.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {CREDIT_CATEGORIES.map((cat) => (
            <div
              key={cat.subtype}
              className="
                bg-gradient-to-br from-[#0b2a6f]/70 to-[#081c45]/80
                border border-blue-500/20
                rounded-3xl p-8
                shadow-[0_20px_60px_-15px_rgba(0,80,255,0.4)]
                hover:shadow-[0_30px_80px_-15px_rgba(0,120,255,0.6)]
                transition-all duration-300
                flex flex-col justify-between
              "
            >
              {/* Верх */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  {cat.label}
                </h2>
                <p className="text-blue-200 leading-relaxed mb-6">
                  {cat.description}
                </p>

                {/* Крупные цифры */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-xl font-bold text-white">
                      {cat.details.amount}
                    </p>
                    <p className="text-xs text-blue-300 mt-1">
                      Maksimal məbləğ
                    </p>
                  </div>

                  <div>
                    <p className="text-xl font-bold text-white">
                      {cat.details.term}
                    </p>
                    <p className="text-xs text-blue-300 mt-1">
                      Müddət
                    </p>
                  </div>

                  <div>
                    <p className="text-xl font-bold text-white">
                      {cat.details.rate}
                    </p>
                    <p className="text-xs text-blue-300 mt-1">
                      İllik faiz (FİFD)
                    </p>
                  </div>
                </div>

                {/* Шартлар */}
                <p className="text-sm text-blue-100">
                  <span className="font-semibold text-white">
                    Şərtlər:
                  </span>{" "}
                  {cat.details.conditions}
                </p>
              </div>

              {/* Кнопки */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <a
                  href={cat.applyUrl}
                  target="_blank"
                  className="
                    bg-blue-600 hover:bg-blue-500
                    text-white font-semibold
                    py-3 rounded-xl
                    text-center transition
                  "
                >
                  Müraciət edin →
                </a>

                <Link
                  href={`/Credits/${cat.subtype}`}
                  className="
                    bg-white/10 hover:bg-white/20
                    text-white font-semibold
                    py-3 rounded-xl
                    text-center transition
                  "
                >
                  Daha ətraflı
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
  