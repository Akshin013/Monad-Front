import "./styles/style.css";
import Navbar from "../Components/Common/Navbar";
import Footer from "../Components/Common/Footer";
import Providers from "./providers";
import MobileBanner from "../Components/Banners/MobileBanner";
import SideBanners from "../Components/Banners/SideBanners";
import { notFound, redirect } from "next/navigation";

// 📡 баннер
async function getSideBanner() {
  try {
    const res = await fetch("http://localhost:5000/api/banners", {
      cache: "no-store",
    });
    const data = await res.json();

    const sideBanners = data.filter(
      (b) =>
        (b.device === "DESKTOP" || b.device === "ALL") &&
        b.type === "SIDE_DESKTOP"
    );

    if (sideBanners.length) {
      const randomIndex = Math.floor(Math.random() * sideBanners.length);
      return sideBanners[randomIndex];
    }

    return null;
  } catch {
    return null;
  }
}

// 📡 статус сайта
async function getMaintenanceStatus() {
  try {
    const res = await fetch("http://localhost:5000/api/settings/status", {
      cache: "no-store",
    });

    const data = await res.json();
    return data.maintenance;
  } catch {
    return false;
  }
}

// 🔥 ГЛАВНОЕ
export default async function RootLayout({ children }) {
  const maintenance = await getMaintenanceStatus();
  const sideBanner = await getSideBanner();

  // 🚧 если сайт в режиме обслуживания → редирект
  // if (maintenance === true) {
  //   redirect("/Maintenance");
  // }

  return (
    <html lang="ru">
      <body className="bg-[#05204A] text-white font-sans relative">
        <Providers>
          <Navbar />

          {/* мобильные баннеры */}
          <div className="2xl:hidden">
            <MobileBanner />
          </div>

          {/* десктоп */}
          <div className="hidden lg:flex">
            {sideBanner && (
              <div className="w-64 hidden 2xl:flex">
                <SideBanners banner={sideBanner} />
              </div>
            )}

            <main className="flex-1 min-w-0 overflow-hidden">
              {children}
            </main>

            {sideBanner && (
              <div className="w-64 hidden 2xl:flex">
                <SideBanners banner={sideBanner} />
              </div>
            )}
          </div>

          {/* мобилка */}
          <div className="lg:hidden">{children}</div>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}