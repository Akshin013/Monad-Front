"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===========================
  // Восстановление сессии
  // ===========================
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // ===========================
  // LOGIN
  // ===========================
  const login = async (email, password, role) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          role,
        }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", res.ok, data);

      if (!res.ok) {
        return { success: false, message: data.message || "Ошибка входа" };
      }

      // ✅ сохраняем
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ обновляем state
      setToken(data.token);
      setUser(data.user);

      return { success: true, user: data.user };
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      return { success: false, message: "Ошибка подключения к серверу" };
    }
  };

  // ===========================
  // REGISTER
  // ===========================
  const register = async (formData) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Ошибка регистрации");
    return data;
  };

  // ===========================
  // LOGOUT
  // ===========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  const forgotPassword = async (email) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || "Ошибка отправки кода",
        };
      }

      return { success: true, message: data.message, code: data.resetCode };
    } catch (err) {
      console.error("FORGOT PASSWORD ERROR:", err);
      return { success: false, message: "Ошибка подключения к серверу" };
    }
  };

  const resetPassword = async (email, code, password) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        code,
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Ошибка смены пароля" };
    }

    return { success: true, message: data.message };
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return { success: false, message: "Ошибка подключения к серверу" };
  }
};

  
  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, register, loading, forgotPassword, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
