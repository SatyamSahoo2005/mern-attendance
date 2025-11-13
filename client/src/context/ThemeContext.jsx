import { createContext } from "react";

export const ThemeContext = createContext({ theme: "dark" });

export default function ThemeProvider({ children }) {
  // Force <html> to always have dark class
  document.documentElement.classList.add("dark");
  document.documentElement.style.colorScheme = "dark";

  return children;
}
