'use client';
import '../scss/globals.scss';
import React, { useRef, useContext, useState } from 'react';
import Link from 'next/link';
import List from '../components/list';
import {
  Album,
  Artist,
  ListAll,
  Search,
  Settings,
  Shuffle,
  Track,
} from '../components/icons';
import { PlayerContext } from '../context/player';
import { getRandomTracksPlaylist } from '../utils/random';
import { Loader } from '../components';

const ITEMS_MENU = [
  { text: 'Tracks', slug: 'tracks', icon: <Track /> },
  { text: 'Artists', slug: 'artists', icon: <Artist /> },
  { text: 'Albums', slug: 'albums', icon: <Album /> },
  { text: 'List', slug: 'list', icon: <ListAll /> },
];

const ITEMS_SORT = ['title', 'artist', 'album', 'year'];

const Home = () => {
  const refHome = useRef<null | HTMLDivElement>(null);
  const {
    libraryTracks,
    search,
    sortBy,
    libraryStatus,
    setSortBy,
    setSearch,
    handlePlayPlaylist,
  } = useContext(PlayerContext);

  const [mode, setMode] = useState<string>('tracks');

  const handleSearch = () => {};

  if (libraryStatus === 'loading') {
    return (
      <main className="page-home">
        <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center">
          <Loader />
        </div>
      </main>
    );
  }

  if (libraryStatus === 'empty') {
    return (
      <main className="page-home">
        <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center">
          <h2 className="mb-4 font-headings text-3xl">
            No library or music found!
          </h2>
          <div className="div">
            <Link className="btn px-10" href="settings">
              Add your library
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-home">
      <div className="flex flex-col" ref={refHome}>
        <div className="sticky top-0 left-0 right-0 z-[9999] -mx-5 bg-base-100/[0.85] px-5 py-3 px-2 backdrop-blur">
          <div className="flex w-full flex-wrap items-center justify-between md:gap-2">
            <div className="library-mode order-0 flex flex-initial basis-1/2 md:basis-[250px]">
              <div className="tabs tabs-boxed bg-base-content/[0.15] font-headings font-semibold dark:bg-base-content/[0.05]">
                {ITEMS_MENU.map((item) => (
                  <div
                    className="tooltip tooltip-right"
                    data-tip={item.text}
                    key={item.slug}
                  >
                    <button
                      type="button"
                      className={`tab mx-1 px-1 capitalize ${
                        mode === item.slug
                          ? 'tab-active !rounded !bg-base-100 !text-base-content'
                          : ''
                      }`}
                      onClick={() => {
                        refHome.current?.scrollIntoView();
                        setMode(item.slug);
                      }}
                    >
                      <span className="text-2xl">{item.icon}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="library-search order-2 mt-3 flex flex-1 basis-full justify-center md:order-1 md:mt-0 md:basis-auto">
              <div className="relative w-full md:max-w-[400px]">
                <input
                  type="search"
                  className="
                    input input-sm w-full rounded-full py-[1.2rem] pl-5 pr-12
                    bg-black/[0.075]
                    focus:bg-black/[0.05]
                    dark:bg-white/[0.05]
                    focus:dark:bg-white/[0.025]
                  "
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  title="search"
                  type="button"
                  className="btn-ghost btn-sm btn-circle btn absolute top-1/2 right-2 !-translate-y-1/2 transform bg-transparent text-xl"
                  onClick={handleSearch}
                >
                  <Search />
                </button>
              </div>
            </div>

            <div className="library-actions order-1 flex flex-initial basis-1/2 flex-wrap justify-end gap-2 md:order-2 md:basis-[250px]">
              {mode === 'tracks' && (
                <div className="sort-by border-content-base/[0.15] flex items-center gap-2 rounded bg-base-content/[0.15] px-2 dark:bg-base-content/[0.05]">
                  <div className="text-xs">Sort by</div>
                  <select
                    name="sort-by"
                    title="sort-by"
                    className="select select-xs rounded capitalize"
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
                title="Random"
                type="button"
                className="btn-sm btn-circle btn text-xl"
                onClick={() =>
                  handlePlayPlaylist(getRandomTracksPlaylist(libraryTracks))
                }
              >
                <Shuffle />
              </button>
              <Link
                title="Settings"
                className="btn-sm btn-circle btn text-xl"
                href="/settings"
              >
                <Settings />
              </Link>
            </div>
          </div>
        </div>
        <List mode={mode} />
      </div>
    </main>
  );
};

export default Home;
