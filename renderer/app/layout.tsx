'use client';
import './layout.module.scss';
import { useEffect } from 'react';
import Link from 'next/link';
import ToggleTheme from '../components/theme-toggle';
import { Home, Settings } from '../components/icons';
import Player from '../components/player';
import { PlayerProvider } from '~/renderer/context/player/';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (
      localStorage.getItem('color-theme') === 'dark' ||
      (!('color-theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <PlayerProvider>
      <html>
        <head />
        <body>
          <div className="relative flex h-screen w-full flex-col">
            <header
              className={`header flex w-full items-center justify-between px-10 pt-3 pb-1`}
            >
              <h1 className="font-headings text-3xl font-semibold">Musica</h1>
              <div className="flex items-center gap-1">
                <Link
                  className="btn-ghost btn-md btn-circle btn text-xl"
                  href="/"
                >
                  <Home />
                </Link>
                <Link
                  className="btn-ghost btn-md btn-circle btn text-xl"
                  href="/settings"
                >
                  <Settings />
                </Link>
                <ToggleTheme />
              </div>
            </header>
            <main className="main relative grid h-full overflow-y-scroll px-10">
              <div className="wrapper mb-[200px] flex-1">{children}</div>
            </main>
            <Player />
          </div>
        </body>
      </html>
    </PlayerProvider>
  );
}
