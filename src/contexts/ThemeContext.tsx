import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  urlExtension: string;
  setUrlExtension: (extension: string) => void;
  getFormattedPath: (path: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [urlExtension, setUrlExtension] = useState(() => {
    const saved = localStorage.getItem("urlExtension");
    return saved || "";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("urlExtension", urlExtension);

    // Update current URL based on setting
    const currentUrl = window.location.href;
    const pathname = window.location.pathname;

    // Remove any existing extensions
    const urlWithoutExtension = currentUrl.replace(
      /\.(html|php|asp|aspx|jsp)$/,
      "",
    );
    const pathWithoutExtension = pathname.replace(
      /\.(html|php|asp|aspx|jsp)$/,
      "",
    );

    if (urlExtension && !pathname.endsWith(urlExtension) && pathname !== "/") {
      // Add extension to URL
      window.history.pushState({}, "", `${urlWithoutExtension}${urlExtension}`);
    } else if (!urlExtension && /\.(html|php|asp|aspx|jsp)$/.test(pathname)) {
      // Remove extension from URL
      window.history.pushState({}, "", urlWithoutExtension);
    }
  }, [urlExtension]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const getFormattedPath = (path: string): string => {
    if (!urlExtension || path === "/") {
      return path;
    }

    // Remove any existing extensions
    const pathWithoutExtension = path.replace(/\.(html|php|asp|aspx|jsp)$/, "");
    return `${pathWithoutExtension}${urlExtension}`;
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        urlExtension,
        setUrlExtension,
        getFormattedPath,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
