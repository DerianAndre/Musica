"use client";

import "./layout.module.scss";

import { useEffect } from "react";
import Player from "../components/player";
import ToggleTheme from "../components/theme-toggle";

export default function Layout({ children }) {
  useEffect(() => {
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Musica</title>
      </head>
      <body>
        <div className="flex flex-col w-full h-screen relative">
          <header
            className={`header flex items-center justify-between p-10 pb-0 w-full`}
          >
            <h1 className="text-3xl font-bold">Musica</h1>
            <ToggleTheme />
          </header>
          <main className={`main grid h-full p-10`}>{children}</main>
          <Player />
        </div>
      </body>
    </html>
  );
}
