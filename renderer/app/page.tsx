'use client';
import '../scss/globals.scss';
import React, { useRef, useContext, useState } from 'react';
import Link from 'next/link';
import List from '../components/list/index';
import {
  Album,
  Artist,
  ListAll,
  Search,
  Settings,
  Shuffle,
  Track,
} from '../components/icons/index';
import { PlayerContext } from '../context/player';
import { getRandomTracksPlaylist } from '../utils/random';

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
    tracks,
    search,
    sortBy,
    libraryMemo,
    libraryStatus,
    setSortBy,
    setSearch,
    handlePlayPlaylist,
  } = useContext(PlayerContext);

  const [mode, setMode] = useState<string>('tracks');

  const handleSearch = () => {};

  return (
    <main className="page-home">
      <div className="flex min-h-full flex-col" ref={refHome}>
        <div className="sticky top-0 left-0 right-0 z-[9999] mb-5 bg-base-100/[0.85] py-3 backdrop-blur">
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <div className="library-mode flex w-[310px]">
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

            {mode === 'tracks' && (
              <div className="library-search flex min-w-[200px] max-w-[400px] flex-1 justify-center">
                <div className="relative w-full">
                  <input
                    type="search"
                    className="input input-sm w-full rounded-full bg-base-content/[0.15] py-[1.2rem] pl-5 pr-12 dark:bg-base-content/[0.05]"
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
            )}

            <div className="library-actions flex w-[310px] flex-wrap justify-end gap-2">
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
                  handlePlayPlaylist(getRandomTracksPlaylist(tracks))
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
