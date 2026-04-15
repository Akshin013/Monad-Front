// // "use client";
// // import { useEffect, useState } from "react";


// // export default function SideBanners() {
// //   const [banner, setBanner] = useState(null);

// //   useEffect(() => {
// //     fetch("http://localhost:5000/api/banners")
// //       .then((res) => res.json())
// //       .then((data) => {
// //         const sideBanners = data.filter(
// //           (b) =>
// //             (b.device === "DESKTOP" || b.device === "ALL") &&
// //             b.type === "SIDE_DESKTOP",
// //         );

// //         if (sideBanners.length) {
// //           const randomIndex = Math.floor(Math.random() * sideBanners.length);
// //           setBanner(sideBanners[randomIndex]);
// //         }
// //       })
// //       .catch(console.error);
// //   }, []);
// //   useEffect(() => {
// //     if (!banner) return;

// //     // Отправляем событие просмотра
// //     fetch(`http://localhost:5000/api/banners/${banner._id}/view`, {
// //       method: "PUT",
// //     }).catch(console.error);
// //   }, [banner]);

// //   if (!banner) return null;

// //   return (
// //     <div className="sticky  bg-red-900 h-[calc(100vh-96px)] w-full flex justify-center">
// //       <a
// //         href={banner.link}
// //         target="_blank"
// //         rel="noopener noreferrer"
// //         className="block rounded-lg overflow-hidden shadow-lg"
// //         onClick={() => {
// //           fetch(`http://localhost:5000/api/banners/${banner._id}/click`, {
// //             method: "PUT",
// //           }).catch(console.error);
// //         }}
// //       >
// //         <img
// //           src={banner.image}
// //           alt={banner.title}
// //           className="w-full object-cover"
// //         />
// //       </a>
// //     </div>
// //   );
// // }


// "use client";
// import { useEffect, useState } from "react";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export default function SideBanners() {
//   const [banner, setBanner] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/banners")
//       .then((res) => res.json())
//       .then((data) => {
//         const sideBanners = data.filter(
//           (b) =>
//             (b.device === "DESKTOP" || b.device === "ALL") &&
//             b.type === "SIDE_DESKTOP",
//         );

//         if (sideBanners.length) {
//           const randomIndex = Math.floor(Math.random() * sideBanners.length);
//           setBanner(sideBanners[randomIndex]);
//         }
//       })
//       .catch(console.error);
//   }, []);

//   useEffect(() => {
//     if (!banner) return;

//     // Отправляем событие просмотра
//     fetch(`http://localhost:5000/api/banners/${banner._id}/view`, {
//       method: "PUT",
//     }).catch(console.error);
//   }, [banner]);

//   if (!banner) return null;

//   return (
//     <div className="sticky top-24 h-[calc(100vh-6rem)] w-full flex justify-center">
//       <a
//         href={banner.link}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="block rounded-lg overflow-hidden shadow-lg h-full"
//         onClick={() => {
//           fetch(`http://localhost:5000/api/banners/${banner._id}/click`, {
//             method: "PUT",
//           }).catch(console.error);
//         }}
//       >
//         <img
//           src={banner.image}
//           alt={banner.title}
//           className="w-full h-full object-cover"
//         />
//       </a>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function SideBanners({ banner: propBanner }) {
  const { user } = useAuth();
  const [banner, setBanner] = useState(propBanner || null);

  useEffect(() => {
    if (user?.role === "ADMIN") return;
    if (propBanner) return; // если баннер передан, не грузим
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`)
      .then((res) => res.json())
      .then((data) => {
        const sideBanners = data.filter(
          (b) =>
            (b.device === "DESKTOP" || b.device === "ALL") &&
            b.type === "SIDE_DESKTOP"
        );

        if (sideBanners.length) {
          const randomIndex = Math.floor(Math.random() * sideBanners.length);
          setBanner(sideBanners[randomIndex]);
        }
      })
      .catch(console.error);
  }, [propBanner, user?.role]);

  useEffect(() => {
    if (!banner) return;

    // Отправляем событие просмотра
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/${banner._id}/view`, {
      method: "PUT",
    }).catch(console.error);
  }, [banner]);

  if (user?.role === "ADMIN" || !banner) return null;

  return (
    <div className="sticky top-14 h-[calc(100vh-6rem)] w-full flex justify-center">
      <a
        href={banner.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden shadow-lg h-full"
        onClick={() => {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/${banner._id}/click`, {
            method: "PUT",
          }).catch(console.error);
        }}
      >
        <img
          src={banner.image}
          alt={banner.title}
          className="w-full h-full object-cover"
        />
      </a>
    </div>
  );
}