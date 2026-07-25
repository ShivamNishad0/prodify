"use client";
import { createContext, useState } from "react";

const ThemeContext = createContext({
  themeColor: "",
  setThemeColor: () => {},
});

export default ThemeContext;

export function ThemeProvider({ children }) {
  const [themeColor, setThemeColor] = useState("#fff");

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}
