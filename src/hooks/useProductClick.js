// hooks/useProductClick.js
import { useState } from "react";

export default function useProductClick(productId) {
  const [clicked, setClicked] = useState(false);

  const sendClick = async () => {
    if (!productId || clicked) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/externalClick`, {
        method: "POST",
      });
      setClicked(true); // чтобы не отправлять несколько раз
    } catch (err) {
      console.error("Ошибка отправки клика:", err);
    }
  };

  return sendClick;
}
