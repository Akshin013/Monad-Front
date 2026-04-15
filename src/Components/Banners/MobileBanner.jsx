// "use client";
// import { useEffect, useState } from "react";

// export default function MobileBanner() {
//   const [banners, setBanners] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/banners")
//       .then((res) => res.json())
//       .then((data) => {
//         const mobile = data.filter(
//           (b) =>
//             (b.device === "MOBILE" || b.device === "ALL") &&
//             (b.type === "TOP_MOBILE" || b.type === "CENTER_MOBILE"),
//         );
//         setBanners(mobile);
//       });
//   }, []);

//   useEffect(() => {
//     if (!banners || banners.length === 0) return;
//     const firstBanner = banners[0];
//     fetch(`http://localhost:5000/api/banners/${firstBanner._id}/view`, {
//       method: "PUT",
//     }).catch(console.error);
//   }, [banners]);

//   if (!banners.length) return null;

//   return (
//     <div className="flex overflow-x-auto w-full bg-red-800 gap-4 ">
//       {banners.map((b) => (
//         <a
//           key={b._id}
//           href={b.link}
//           className="min-w-full rounded-lg overflow-hidden shadow-lg"
//           target="_blank"
//           rel="noopener noreferrer"
//           onClick={() => {
//             fetch(`http://localhost:5000/api/banners/${banners._id}/click`, {
//               method: "PUT",
//             }).catch(console.error);
//           }}
//         >
//           <img
//             src={b.image}
//             alt={b.title}
//             className="h-40 w-full object-cover"
//           />
//         </a>
//       ))}
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function MobileBanner() {
  const { user } = useAuth();
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    if (user?.role === "ADMIN") return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`)
      .then((res) => res.json())
      .then((data) => {
        const mobile = data.filter(
          (b) =>
            (b.device === "MOBILE" || b.device === "ALL") &&
            (b.type === "TOP_MOBILE" || b.type === "CENTER_MOBILE")
        );

        if (mobile.length === 0) return;

        // 🎯 Выбираем случайный баннер
        const randomBanner =
          mobile[Math.floor(Math.random() * mobile.length)];

        setBanner(randomBanner);

        // 👁️ Учитываем просмотр
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/banners/${randomBanner._id}/view`,
          {
            method: "PUT",
          }
        ).catch(console.error);
      });
  }, [user?.role]);

  if (user?.role === "ADMIN" || !banner) return null;

  return (
    <div className="w-full">
      <a
        href={banner.link}
        className="block overflow-hidden shadow-lg"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/banners/${banner._id}/click`,
            {
              method: "PUT",
            }
          ).catch(console.error);
        }}
      >
        <img
          src={banner.image}
          alt={banner.title}
          className="h-40 w-full object-cover"
        />
      </a>
    </div>
  );
}
