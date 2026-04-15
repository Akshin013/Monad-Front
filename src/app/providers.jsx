"use client";

// import { AuthProvider } from "@/hooks/useAuth";
import { AuthProvider } from "../hooks/useAuth.js";

export default function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
