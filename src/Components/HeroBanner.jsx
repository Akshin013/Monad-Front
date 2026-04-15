"use client";
import { useEffect, useState } from "react";

export default function HeroBanner() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setBanners(data);
      });
  }, []);

  if (!banners.length) return <p>Нет баннеров</p>;

  return (
    <div className="w-full h-75">
      <img
        src={banners[0].image}
        alt={banners[0].title}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
