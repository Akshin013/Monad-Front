// module.exports = {
//   content: [
//     './src/**/*.{js,jsx,ts,tsx,html}',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: '#0B3D91',
//         'primary-dark': '#082B6B',
//         accent: '#1E90FF',
//       },
//     },
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#ffffff",
          dark: "#0f172a",
        },
        text: {
          light: "#0f172a",
          dark: "#f8fafc",
        },
        card: {
          light: "#f1f5f9",
          dark: "#1e293b",
        },
        primary: {
          DEFAULT: "#0B3D91",
          dark: "#1E90FF",
        },
      },
    },
  },
  plugins: [],
};