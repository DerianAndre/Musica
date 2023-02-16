"use client";

import "../scss/globals.scss";

import React, { useState, useEffect, useMemo } from "react";
import loadLibrary from "../../library";
import List from "../components/list";
import { Shuffle } from "../components/icons";
import { handlePlayRandom } from "../utils/random";

const menu = ["tracks", "artists", "albums", "list"];

const Home = () => {
  const [mode, setMode] = useState("tracks");
  const [library, setLibrary] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toggleSearch, setToggleSearch] = useState(false);

  const handlePlay = (file) => {
    window.electron.player.play(file);
  };

  const handleSearch = () => {
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
          track?.title?.toLowerCase().includes(lowerCaseSearchTerm)
        );
      });

      // todo filter tracks
      if (filteredAlbums?.length && filtered) {
        filtered[artist] = {
          albums: filteredAlbums,
        };
      }
      console.log(filtered);

      return filtered;
    }, {});
  }, [libraryMemo, toggleSearch]);

  useEffect(() => {
    loadLibrary({ setLibrary });
  }, []);

  return (
    <div className="flex min-h-full flex-col">
      <div className="sticky top-0 left-0 right-0 bg-base-100 mb-5 z-[9999]">
        <div className="flex w-full items-center justify-between">
          <div className="tabs gap-5 font-headings font-semibold">
            {menu.map((item) => (
              <button
                key={item}
                className={`tab tab-bordered uppercase text-md px-0 ${
                  mode === item ? "tab-active" : ""
                }`}
                onClick={() => setMode(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              className="btn btn-xs gap-2"
              onClick={() => handlePlayRandom(library, handlePlay)}
            >
              <Shuffle /> Random play
            </button>
            <input
              type="text"
              className="input w-full max-w-xs bg-slate-500/25 hidden"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-sm gap-2 hidden" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>
      <List mode={mode} library={libraryFiltered} handlePlay={handlePlay} />
    </div>
  );
};

export default Home;
