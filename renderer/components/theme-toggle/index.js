import React, { useEffect, useState } from "react";
import { DarkMode, LightMode } from "../icons";

const ToggleTheme = () => {
  const [theme, setTheme] = useState("");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.querySelector("html").setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    let newTheme = "dark";
    if (!localStorage.getItem("theme")) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        newTheme = "dark";
      } else {
        newTheme = "light";
      }
    } else {
      newTheme = localStorage.getItem("theme");
    }
    setTheme(newTheme);
    localStorage?.setItem("theme", newTheme);
    document.querySelector("html").setAttribute("data-theme", newTheme);
  }, []);

  return (
    <button
      className="btn btn-ghost btn-circle btn-md text-xl swap swap-rotate"
      onClick={toggleTheme}
    >
      {theme === "light" ? <DarkMode /> : <LightMode />}
    </button>
  );
};

export default ToggleTheme;
