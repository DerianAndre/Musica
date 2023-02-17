'use client';
import '../scss/globals.scss';
import React, { useRef, useContext, useState } from 'react';
import Link from 'next/link';
import List from '../components/list';
import { Shuffle } from '../components/icons';
import { handlePlayRandom } from '../utils/random';
import { PlayerContext } from '../context/player';

const menu = ['tracks', 'artists', 'albums', 'list'];

const Home = () => {
  const refHome = useRef<null | HTMLDivElement>(null);
  const { tracks, library, libraryMemo, libraryStatus } =
    useContext(PlayerContext);

  const [mode, setMode] = useState<string>('tracks');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toggleSearch, setToggleSearch] = useState<boolean>(false);

  const handlePlay = (data: void): void => {
    window.electron.player.play(data);
  };
  const handleSearch = (): void => {
    setToggleSearch((old) => !old);
  };

  return (
    <main className="page-home">
      <div className="flex min-h-full flex-col" ref={refHome}>
        <div className="sticky top-0 left-0 right-0 z-[9999] mb-5 bg-base-100">
          <div className="flex w-full items-center justify-between">
            <div className="tabs gap-5 font-headings font-semibold">
              {menu.map((item) => (
                <button
                  key={item}
                  className={`text-md tab tab-bordered px-0 uppercase ${
                    mode === item ? 'tab-active' : ''
                  }`}
                  onClick={() => {
                    refHome.current?.scrollIntoView();
                    setMode(item);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                className="btn-xs btn gap-2"
                onClick={() => handlePlayRandom(library, handlePlay)}
              >
                <Shuffle /> Random play
              </button>
              <input
                type="text"
                className="input hidden w-full max-w-xs bg-slate-500/25"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="btn-sm btn hidden gap-2"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        {libraryStatus === 'empty' && (
          <div className="flex h-full flex-1 flex-col items-center justify-center place-self-stretch">
            <h2 className="mb-4 font-headings text-3xl">No library found!</h2>
            <div className="div">
              <Link className="btn px-10" href="settings">
                Add your library
              </Link>
            </div>
          </div>
        )}
        <List
          mode={mode}
          tracks={tracks}
          library={libraryMemo}
          handlePlay={handlePlay}
        />
      </div>
    </main>
  );
};

export default Home;
