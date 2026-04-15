"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
// import { useAuth } from "../../../app/Context/AuthContext";
import { useAuth } from "../../../hooks/useAuth";
import { FaCalculator } from "react-icons/fa6";
import { ADMIN_NAV_LINKS } from "../../AdminSidebar";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = user?.role === "ADMIN";

  // Закрывать меню при смене страницы
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const publicLinks = [
    { href: "/Banks", label: "Banklar" },
    { href: "/Insurance", label: "Страхование" },
    { href: "/Bokts", label: "Бокт" },
  ];
  const desktopLinks = isAdmin
    ? [{ href: "/Admin", label: "Админ-панель" }]
    : publicLinks;
  const mobileLinks = isAdmin
    ? ADMIN_NAV_LINKS.map((link) => ({ href: link.href, label: link.name }))
    : publicLinks;

  const isActive = (href) => pathname === href;

  return (
    <>
      <nav className="sticky top-0 z-50  bg-white/80 backdrop-blur border-b border-slate-200">
        <div className=" lg:flex">
          {/* левый баннер отступ */}
          <div className="w-58 hidden xl:flex"></div>

          {/* navbar контент */}
          <div className="flex-1">
            <div className="flex items-center justify-between h-16 px-6">
              <Link
                href="/"
                className="text-2xl font-bold tracking-tight text-slate-900"
              >
                <img
                  src="https://res.cloudinary.com/dvm6my9na/image/upload/v1773315516/png1_urfxxj.png"
                  alt="Dillers"
                  className="h-8 мсч 2 w-auto"
                />
              </Link>

              {/* DESKTOP MENU */}
              <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                {desktopLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative transition ${
                      isActive(link.href)
                        ? "text-blue-600"
                        : "text-slate-600 hover:text-blue-600"
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </Link>
                ))}

                {!isAdmin && (
                  <Link
                    href="/Calculator"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
                  >
                    <FaCalculator className="text-slate-600" />
                  </Link>
                )}
              </div>

              {/* RIGHT ACTIONS */}
              <div className="hidden md:flex items-center gap-4">

                {user ? (
                  <>
                    {user.role === "ADMIN" && (
                      <Link
                        href="/Admin"
                        className="text-sm font-medium text-slate-600 hover:text-blue-600"
                      >
                        Admin
                      </Link>
                    )}
                    <Link
                      href="/Profile"
                      className="text-sm font-medium text-slate-600 hover:text-blue-600"
                    >
                      Профиль
                    </Link>
                    <Link
                      href="/"
                      onClick={logout}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                    >
                      Выйти
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/Auth/Login"
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    Войти
                  </Link>
                )}
              </div>

              {/* BURGER */}
              <div
                onClick={() => setMenuOpen(true)}
                className="md:hidden
             flex items-center justify-center
             w-8 h-10
             rounded-lg
             border border-slate-200
             text-slate-700 bg-blue-500
             hover:bg-slate-100
             transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
            </div>
          </div>
          {/* правый баннер отступ */}
          <div className="w-58 hidden xl:flex"></div>
        </div>
      </nav>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition"
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b">
          <span className="font-bold text-lg text-slate-800">Меню</span>
          <div
            onClick={() => setMenuOpen(false)}
            className="bg-blue-500 p-1 rounded-lg flex items-center justify-center w-8 h-10"
          >
            <svg
              className="w-6 h-6 text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <div className="px-6 py-4 flex flex-col gap-3 text-slate-700 text-base">
          {mobileLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`py-2 px-2 rounded-lg transition ${
                isActive(link.href)
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {!isAdmin && (
            <Link
              href="/Calculator"
              className="mt-2 flex items-center justify-center gap-2 bg-slate-100 py-2 rounded-lg"
            >
              <FaCalculator />
              Калькулятор
            </Link>
          )}

          {isAdmin && (
            <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
              Выберите раздел админки для быстрого перехода.
            </div>
          )}

          <div className="pt-4 mt-4 border-t border-slate-200">
            {user ? (
              <>
                <Link
                  href="/Profile"
                  className="block py-2 px-2 rounded-lg hover:bg-slate-100"
                >
                  Профиль
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    href="/Admin"
                    className="block py-2 px-2 rounded-lg hover:bg-slate-100"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/"
                  onClick={logout}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Выйти
                </Link>
              </>
            ) : (
              <Link
                href="/Auth/Login"
                className="block text-center bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// "use client";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import { useAuth } from "../../../hooks/useAuth";
// import { FaCalculator } from "react-icons/fa6";
// import { IoIosSearch } from "react-icons/io";
// import { IoMdClose } from "react-icons/io";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const pathname = usePathname();

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);

//   useEffect(() => {
//     setMenuOpen(false);
//     setSearchOpen(false);
//   }, [pathname]);

//   const toggleSearch = () => {
//     setSearchOpen(!searchOpen);
//   };

//   const links = [
//     { href: "/Banks", label: "Banklar" },
//     { href: "/Insurance", label: "Страхование" },
//     { href: "/Bokts", label: "Бокт" },
//   ];

//   const isActive = (href) => pathname === href;

//   return (
//     <>
//       <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex items-center justify-between h-16">
//             {/* LOGO */}
//             <Link
//               href="/"
//               className="text-2xl font-bold tracking-tight text-slate-900"
//             >
//               <span className="text-blue-600">Dillers</span> Company
//             </Link>

//             {/* CENTER BLOCK */}
//             <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 text-sm font-medium">
//               {searchOpen ? (
//                 <div className="flex items-center gap-3 w-[300px]">
//                   <input
//                     autoFocus
//                     type="text"
//                     placeholder="Поиск..."
//                     className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <IoMdClose
//                     size={24}
//                     onClick={toggleSearch}
//                     className="cursor-pointer text-slate-600 hover:text-blue-600 transition"
//                   />
//                 </div>
//               ) : (
//                 <>
//                   {links.map((link) => (
//                     <Link
//                       key={link.href}
//                       href={link.href}
//                       className={`relative transition ${
//                         isActive(link.href)
//                           ? "text-blue-600"
//                           : "text-slate-600 hover:text-blue-600"
//                       }`}
//                     >
//                       {link.label}
//                       {isActive(link.href) && (
//                         <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
//                       )}
//                     </Link>
//                   ))}

//                   <Link
//                     href="/Calculator"
//                     className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
//                   >
//                     <FaCalculator className="text-slate-600" />
//                   </Link>

//                   <IoIosSearch
//                     size={22}
//                     onClick={toggleSearch}
//                     className="cursor-pointer text-slate-600 hover:text-blue-600 transition"
//                   />
//                 </>
//               )}
//             </div>

//             {/* RIGHT ACTIONS */}
//             {!searchOpen && (
//               <div className="hidden md:flex items-center gap-4">
//                 {user ? (
//                   <>
//                     {user.role === "ADMIN" && (
//                       <Link
//                         href="/Admin"
//                         className="text-sm font-medium text-slate-600 hover:text-blue-600"
//                       >
//                         Admin
//                       </Link>
//                     )}
//                     <Link
//                       href="/Profile"
//                       className="text-sm font-medium text-slate-600 hover:text-blue-600"
//                     >
//                       Профиль
//                     </Link>
//                     <Link
//                       href="/"
//                       onClick={logout}
//                       className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
//                     >
//                       Выйти
//                     </Link>
//                   </>
//                 ) : (
//                   <Link
//                     href="/Auth/Login"
//                     className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
//                   >
//                     Войти
//                   </Link>
//                 )}
//               </div>
//             )}

//             {/* BURGER */}
//             {!searchOpen && (
//               <div
//                 onClick={() => setMenuOpen(true)}
//                 className="md:hidden flex items-center justify-center w-8 h-10 rounded-lg border border-slate-200 text-slate-700 bg-blue-500 hover:bg-slate-100 transition"
//               >
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 </svg>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* OVERLAY */}
//       {menuOpen && (
//         <div
//           onClick={() => setMenuOpen(false)}
//           className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition"
//         />
//       )}

//       {/* MOBILE DRAWER */}
//       <div
//         className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ${
//           menuOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex items-center justify-between px-6 h-16 border-b">
//           <span className="font-bold text-lg text-slate-800">Меню</span>
//           <div
//             onClick={() => setMenuOpen(false)}
//             className="bg-blue-500 p-1 rounded-lg flex items-center justify-center w-8 h-10"
//           >
//             <svg
//               className="w-6 h-6 text-slate-700"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
