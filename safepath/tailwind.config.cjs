/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { green:"#6BC96A", blue:"#2C69D8", red:"#C03F38", mint:"#04B46B" },
        neutral: {
          white:"#FFFDF5", gray50:"#F2F2F2", gray100:"#DDDDDD",
          gray200:"#A2A2A2", gray300:"#787878", black:"#111111",
        },
        background: { base:"#F1F6EE" },
      },
      fontFamily: { pretendard:["Pretendard","ui-sans-serif","system-ui"] },
      fontSize: {
        "bold-40": ["40px", { fontWeight:"700" }],
        "regular-16": ["16px", { fontWeight:"400" }],
      },
    },
  },
  plugins: [],
};
