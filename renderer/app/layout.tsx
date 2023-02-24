'use client';
import './layout.module.scss';
import { useEffect } from 'react';
import Link from 'next/link';
import Player from '../components/player/index';
import { PlayerProvider } from '~/renderer/context/player/';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlayerProvider>
      <html>
        <head />
        <body>
          <div className="relative flex h-screen w-full flex-col">
            <header
              className={`header flex w-full items-center justify-between px-5 pt-3 pb-1`}
            >
              <Link href="/">
                <h1 className="font-headings text-3xl font-semibold">Musica</h1>
              </Link>
              <div className="flex items-center gap-1"></div>
            </header>
            <main className="main relative grid h-full overflow-y-scroll px-5">
              <div className="wrapper mb-[200px] flex-1">{children}</div>
            </main>
            <Player />
          </div>
        </body>
      </html>
    </PlayerProvider>
  );
}
