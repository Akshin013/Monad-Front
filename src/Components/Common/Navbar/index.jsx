"use client";
import "@/styles/style.css";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/app/Context/AuthContext";
// import { FiCalculator } from "react-icons/fi";
import CalculatorModal from "@/Components/CalculatorModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
// const { user, logout } = useAuth();

{user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}
{user?.role === "DEALER" && <Link href="/dealer">Dealer</Link>}

  return (
    <nav className="bg-[#0B3D91] px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Левый блок */}
        <Link href="/" className="font-bold text-xl text-[#1E90FF]">
          Dillers Company
        </Link>
        {/* Бургер кнопка для мобильных */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Ссылки для десктопа */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/Credits" className="hover:text-[#1E90FF] transition">
            Кредиты
          </Link>
          <Link href="/Cards" className="hover:text-[#1E90FF] transition">
            Kardlar
          </Link>
          <Link href="/Products" className="hover:text-[#1E90FF] transition">
            Produktlar
          </Link>
          <Link href="/Products" className="hover:text-[#1E90FF] transition">
            Produktlar
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-[#1E90FF] transition">
                Dashboard
              </Link>
              <Link href="/profile" className="hover:text-[#1E90FF] transition">
                Profile
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="hover:text-[#1E90FF] transition">
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="bg-[#1E90FF] px-3 py-1 rounded text-white font-semibold hover:bg-blue-700 transition"
              >
                Logout
              </button>
              

            </>
          ) : (
            // БЛОК ЛОГИН/РЕГ
            <div>
              <Link
                href="/Role"
                className="bg-white text-[#0B3D91] px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Login / Register
              </Link>
              
            </div>
          )}
        </div>
      </div>

      {/* Мобильное меню */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2 bg-[#0B3D91] p-4 rounded">
          <Link href="/Banks" className="hover:text-[#1E90FF] transition">
            Banklar
          </Link>
          <Link href="/Products" className="hover:text-[#1E90FF] transition">
            Produktlar
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-[#1E90FF] transition">
                Dashboard
              </Link>
              <Link href="/profile" className="hover:text-[#1E90FF] transition">
                Profile
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="hover:text-[#1E90FF] transition">
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="bg-[#1E90FF] px-3 py-1 rounded text-white font-semibold hover:bg-blue-700 transition mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/Role"
              className="bg-white text-[#0B3D91] px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition mt-2 text-center"
            >
              Login / Register
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
