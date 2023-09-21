'use client';
import './layout.module.scss';
import React from 'react';
import Player from '../components/player';
import { PlayerProvider } from '~/renderer/context/player/';

const metadata = {
  title: {
    default: 'Musica',
    template: '%s | Musica',
  },
};

interface IProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: IProps) => {
  return (
    <PlayerProvider>
      <html>
        <head />
        <body className="relative flex h-screen w-full flex-col">
          <main className="main relative h-full overflow-y-scroll px-5">
            <div className="main-wrapper mb-[200px] flex-1">{children}</div>
          </main>
          <Player />
        </body>
      </html>
    </PlayerProvider>
  );
};

export default RootLayout;
