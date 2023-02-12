import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { DarkMode, LightMode } from "../icons";

const ToggleTheme = () => {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <button
      className="btn btn-ghost btn-circle btn-md text-xl swap swap-rotate"
      onClick={toggleTheme}
    >
      {theme === "dark" ? <DarkMode /> : <LightMode />}
    </button>
  );
};

export default ToggleTheme;
