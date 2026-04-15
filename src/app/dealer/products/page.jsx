"use client";
import { useEffect, useState } from "react";
import { getDealerProducts } from "../../../Services/products.js";

export default function DealerProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getDealerProducts().then(setProducts);
  }, []);

  return products.map(p => <div key={p._id}>{p.name}</div>);
}
