"use client";

import "./layout.module.scss";
//import library from "../../library/index.json";

import { useEffect } from "react";
import Link from "next/link";
import Player from "../components/player";
import ToggleTheme from "../components/theme-toggle";
import { Home, Settings } from "../components/icons";

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
            className={`header flex items-center justify-between px-10 pt-3 pb-1 w-full`}
          >
            <h1 className="text-4xl font-medium">Musica</h1>
            <div className="flex items-center gap-1">
              <Link
                className="btn btn-ghost btn-circle btn-md text-xl"
                href="/"
              >
                <Home />
              </Link>
              <Link
                className="btn btn-ghost btn-circle btn-md text-xl"
                href="/settings"
              >
                <Settings />
              </Link>
              <ToggleTheme />
            </div>
          </header>
          <main className="main grid h-full overflow-y-scroll relative px-10">
            <div className="wrapper mb-[250px]">{children}</div>
          </main>
          <Player library={{}} />
        </div>
      </body>
    </html>
  );
}
