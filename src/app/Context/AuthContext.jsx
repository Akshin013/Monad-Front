"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Восстановление токена при загрузке
  useEffect(() => {
    const loadToken = async () => {
      if (typeof window === "undefined") return;

      const savedToken = localStorage.getItem("token");
      if (!savedToken) return;

      try {
        // Динамический импорт
        const jwtModule = await import("jwt-decode");
        const jwtDecode = jwtModule.default || jwtModule; // ✅ правильно для Turbopack
        const decoded = jwtDecode(savedToken);
        setUser(decoded);
        setToken(savedToken);
      } catch (err) {
        console.error("Ошибка декодирования токена", err);
        localStorage.removeItem("token");
      }
    };
    loadToken();
  }, []);

  // LOGIN
  const login = async (email, password, role) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);

        const jwtModule = await import("jwt-decode");
        const jwtDecode = jwtModule.default || jwtModule; // ✅ безопасно
        const decodedUser = jwtDecode(data.token);

        setUser(decodedUser);
        setToken(data.token);
        return { user: decodedUser };
      } else {
        return { message: data.message || "Ошибка входа" };
      }
    } catch (err) {
      console.error(err);
      return { message: "Ошибка сервера" };
    }
  };

  // REGISTER
  const register = async (formData) => {
    const res = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Ошибка регистрации");
    return data;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
