"use client";
import { useEffect, useState } from "react";

export default function useProductView(productId) {
  const [viewSent, setViewSent] = useState(false);

  useEffect(() => {
    if (!productId || viewSent) return;

    const sendView = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/view`, {
          method: "POST",
        });
        setViewSent(true);
      } catch (err) {
        console.error("Ошибка увеличения просмотров:", err);
      }
    };

    sendView();
  }, [productId, viewSent]);
}