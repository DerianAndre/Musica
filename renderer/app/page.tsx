'use client';
import '../scss/globals.scss';
import React, { useRef, useContext, useState } from 'react';
import Link from 'next/link';
import List from '../components/list';
import { Shuffle } from '../components/icons';
import { PlayerContext } from '../context/player';
import { getRandomTracksPlaylist } from '../utils/random';

const ITEMS_MENU = ['tracks', 'artists', 'albums', 'list'];
const ITEMS_SORT = ['title', 'artist', 'album', 'year'];

const Home = () => {
  const refHome = useRef<null | HTMLDivElement>(null);
  const {
    tracks,
    sortBy,
    libraryMemo,
    libraryStatus,
    setSortBy,
    handlePlayPlaylist,
  } = useContext(PlayerContext);

  const [mode, setMode] = useState<string>('tracks');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toggleSearch, setToggleSearch] = useState<boolean>(false);

  const handleSearch = (): void => {
    setToggleSearch((old) => !old);
  };

  return (
    <main className="page-home">
      <div className="flex min-h-full flex-col" ref={refHome}>
        <div className="sticky top-0 left-0 right-0 z-[9999] mb-5 bg-base-100">
          <div className="flex w-full flex-wrap items-center justify-between">
            <div className="tabs gap-5 font-headings font-semibold">
              {ITEMS_MENU.map((item) => (
                <button
                  key={item}
                  type="button"
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
            <div className="flex flex-wrap gap-3">
              {mode === 'tracks' && (
                <div className="sort-by flex items-center gap-1">
                  <div className="text-xs">Sort by</div>
                  <select
                    name="sort-by"
                    title="sort-by"
                    className="select-bordered select select-xs rounded capitalize"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {ITEMS_SORT.map((item, index) => (
                      <option key={item + index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <button
                type="button"
                className="btn-xs btn gap-2"
                onClick={
                  () => handlePlayPlaylist(getRandomTracksPlaylist(tracks))
                  //handlePlayMode('random-all')
                }
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
                type="button"
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
        <List mode={mode} tracks={tracks} library={libraryMemo} />
      </div>
    </main>
  );
};

export default Home;
