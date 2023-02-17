'use client';
import '../scss/globals.scss';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import loadLibrary from '~/library';
import List from '../components/list';
import { Shuffle } from '../components/icons';
import { handlePlayRandom } from '../utils/random';

const menu = ['tracks', 'artists', 'albums', 'list'];

const Home = () => {
  const [mode, setMode] = useState<string>('tracks');
  const [status, setStatus] = useState<string>('loading');
  const [library, setLibrary] = useState<object>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toggleSearch, setToggleSearch] = useState<boolean>(false);

  const handlePlay = (data: void): void => {
    window.electron.player.play(data);
  };

  const handleSearch = (): void => {
    setToggleSearch((old) => !old);
  };

  const libraryMemo = useMemo(() => library, [library]);

  const libraryFiltered = useMemo(() => {
    if (!libraryMemo || !searchTerm) {
      return libraryMemo;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return Object.entries(libraryMemo).reduce((filtered, [artist, object]) => {
      if (!object.albums) return;

      const filteredAlbums = object.albums?.filter((album) => {
        if (
          artist?.toLowerCase().includes(lowerCaseSearchTerm) ||
          album?.title.toLowerCase().includes(lowerCaseSearchTerm)
        ) {
          return true;
        }
        return album?.tracks.some((track) =>
          track?.title?.toLowerCase().includes(lowerCaseSearchTerm),
        );
      });

      // todo filter tracks
      if (filteredAlbums?.length && filtered) {
        filtered[artist] = {
          albums: filteredAlbums,
        };
      }

      return filtered;
    }, {});
  }, [libraryMemo, toggleSearch]);

  useEffect(() => {
    loadLibrary({ setLibrary, setStatus });
  }, []);

  return (
    <main className="page-home">
      <div className="flex min-h-full flex-col">
        <div className="sticky top-0 left-0 right-0 z-[9999] mb-5 bg-base-100">
          <div className="flex w-full items-center justify-between">
            <div className="tabs gap-5 font-headings font-semibold">
              {menu.map((item) => (
                <button
                  key={item}
                  className={`text-md tab tab-bordered px-0 uppercase ${
                    mode === item ? 'tab-active' : ''
                  }`}
                  onClick={() => setMode(item)}
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
        {status === 'ready' && !Object.keys(library).length ? (
          <div className="flex h-full flex-1 flex-col items-center justify-center place-self-stretch">
            <h2 className="mb-4 font-headings text-3xl">No library found!</h2>
            <div className="div">
              <Link className="btn px-10" href="settings">
                Add your library
              </Link>
            </div>
          </div>
        ) : (
          <List mode={mode} library={library} handlePlay={handlePlay} />
        )}
      </div>
    </main>
  );
};

export default Home;
