import { useState, useEffect, useCallback } from "react";

export function useTheme() {
  const [theme, setThemeState] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("wizarding-theme");
    return (saved === "light") ? "light" : "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("wizarding-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState(t => t === "dark" ? "light" : "dark");
  }, []);

  return { theme, toggleTheme };
}
