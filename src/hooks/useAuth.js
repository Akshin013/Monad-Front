"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Создаем контекст
const AuthContext = createContext();

// Провайдер
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // текущий пользователь
  const [token, setToken] = useState(null); // JWT
  const [loading, setLoading] = useState(true); // флаг загрузки сессии

  // ===========================
  // Восстановление сессии при загрузке страницы
  // ===========================
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      
      }
    } catch (err) {
      console.error("Ошибка восстановления сессии:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    setLoading(false);
  }, []);

  // ===========================
  // LOGIN
  // ===========================
  const login = async (email, password) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) return { success: false, message: data.message };

      // ✅ сохраняем токен и user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

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
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Ошибка регистрации");

      return { success: true, data };
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      return { success: false, message: err.message || "Ошибка регистрации" };
    }
  };

  // ===========================
  // LOGOUT
  // ===========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
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


  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, register, loading, forgotPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования
export const useAuth = () => useContext(AuthContext);


// "use client";

// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userData = localStorage.getItem("user");

//     if (token && userData) {
//       try {
//         setUser(JSON.parse(userData));
//       } catch (err) {
//         console.error("Ошибка парсинга user из localStorage", err);
//         setUser(null);
//       }
//     }

//     setLoading(false);
//   }, []);

//   const login = (token, userData) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         login,
//         logout
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);

//   if (!context) {
//     console.warn("useAuth используется вне AuthProvider");
//   }

//   return context;
// }
