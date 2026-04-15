    "use client";
import { useState } from "react";
// import { forgotPassword } from "@/Services/auth.js";

export default function ForgotPage() {
  const [email, setEmail] = useState("");

  return (
    <>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <button onClick={() => forgotPassword(email)}>Отправить код</button>
    </>
  );
}
