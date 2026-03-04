"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type FontSize = "sm" | "base" | "lg";

interface Preferences {
  theme: Theme;
  fontSize: FontSize;
  toggleTheme: () => void;
  cycleFontSize: () => void;
}

const PreferencesContext = createContext<Preferences>({
  theme: "light",
  fontSize: "base",
  toggleTheme: () => {},
  cycleFontSize: () => {},
});

export function usePreferences() {
  return useContext(PreferencesContext);
}

export default function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("light");
  const [fontSize, setFontSize] = useState<FontSize>("base");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedFontSize = localStorage.getItem("fontSize") as FontSize | null;
    if (savedTheme) setTheme(savedTheme);
    if (savedFontSize) setFontSize(savedFontSize);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize, mounted]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const cycleFontSize = () =>
    setFontSize((s) => (s === "sm" ? "base" : s === "base" ? "lg" : "sm"));

  return (
    <PreferencesContext.Provider
      value={{ theme, fontSize, toggleTheme, cycleFontSize }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}
