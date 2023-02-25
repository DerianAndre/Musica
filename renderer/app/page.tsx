'use client';
import '../scss/globals.scss';
import React, { useRef, useContext, useState } from 'react';
import Link from 'next/link';
import List from '../components/list';
import { Shuffle } from '../components/icons/index';
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
    setSearch,
    handlePlayPlaylist,
  } = useContext(PlayerContext);

  const [mode, setMode] = useState<string>('tracks');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (): void => {
    setSearch(searchTerm);
  };

  return (
    <main className="page-home">
      <div className="flex min-h-full flex-col" ref={refHome}>
        <div className="sticky top-0 left-0 right-0 z-[9999] mb-5 bg-base-100/[0.85] py-3 backdrop-blur">
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <div className="library-mode flex w-[310px]">
              <div className="tabs tabs-boxed w-full bg-base-content/[0.15] font-headings font-semibold dark:bg-base-content/[0.05]">
                {ITEMS_MENU.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`tab capitalize ${
                      mode === item
                        ? 'tab-active !rounded !bg-base-100 !text-base-content'
                        : ''
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
            </div>

            {mode === 'tracks' && (
              <div className="library-search flex max-w-[400px] flex-1 justify-center">
                <div className="relative w-full">
                  <input
                    type="search"
                    className="input input-sm w-full bg-base-content/[0.1] pr-12"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onBlur={handleSearch}
                    onKeyDown={(e) => {
                      e.key === 'Enter' && handleSearch();
                    }}
                  />
                  <button
                    title="search"
                    type="button"
                    className="btn-ghost btn-sm btn absolute top-0 right-0 bg-transparent"
                    onClick={handleSearch}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="library-actions flex w-[310px] flex-wrap justify-end gap-3">
              {mode === 'tracks' && (
                <div className="sort-by flex items-center gap-1">
                  <div className="text-xs">Sort by</div>
                  <select
                    name="sort-by"
                    title="sort-by"
                    className="select-bordered select select-sm rounded capitalize"
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
                className="btn-sm btn gap-2"
                onClick={() =>
                  handlePlayPlaylist(getRandomTracksPlaylist(tracks))
                }
              >
                <Shuffle />
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
