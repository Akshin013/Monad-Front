"use client";
import { useState } from "react";
import { createProduct } from "../../../Services/products.js";

export default function CreateProduct() {
  const [name, setName] = useState("");

  return (
    <>
      <input placeholder="Название" onChange={e => setName(e.target.value)} />
      <button onClick={() => createProduct({ name })}>Создать</button>
    </>
  );
}
