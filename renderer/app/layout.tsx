'use client';
import './layout.module.scss';
import React from 'react';
import Player from '../components/player/index';
import { PlayerProvider } from '~/renderer/context/player/';

export const metadata = {
  title: {
    default: 'Musica',
    template: '%s | Musica',
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PlayerProvider>
      <html>
        <head />
        <body className="relative flex h-screen w-full flex-col">
          <main className="main relative grid h-full overflow-y-scroll px-5">
            <div className="main-wrapper mb-[200px] flex-1">{children}</div>
          </main>
          <Player />
        </body>
      </html>
    </PlayerProvider>
  );
};

export default RootLayout;
