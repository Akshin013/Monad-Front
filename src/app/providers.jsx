"use client";

import { AuthProvider } from "./Context/AuthContext";

export default function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
