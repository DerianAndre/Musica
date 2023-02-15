"use client";

import "../scss/globals.scss";

import React, { useState, useEffect, useMemo } from "react";
import List from "../components/list";
import { Shuffle } from "../components/icons";
import { Loader } from "../components";
import { handlePlayRandom } from "../utils/random";
import { useLocalStorage } from "usehooks-ts";

const Home = () => {
  const [status, setStatus] = useState("ready");
  const [mode, setMode] = useLocalStorage("mode", "artists");
  const [list, setList] = useState(null);
  const [library, setLibrary] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toggleSearch, setToggleSearch] = useState(false);

  //const List = lazy(() => import("../components/list"));

  const loadList = async () => {
    setStatus("loading");
    return new Promise((res, rej) => {
      import(`../../library/list.json`)
        .then((data) => {
          setList(data?.default);
        })
        .catch((error) => {
          setList({});
        })
        .finally(() => {
          setStatus("ready");
        });
    });
  };

  const loadListChunk = async (chunk) => {
    if (!chunk || !Object.keys(chunk).length) return;
    return new Promise((resolve, reject) => {
      import(`../../library/chunks/${chunk.file}.json`)
        .then((data) => {
          setLibrary((old) => ({ ...old, [chunk.artist]: data?.default }));
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  const loadLibrary = async () => {
    if (!list || !Object.keys(list).length) return;
    list.forEach(async (chunk) => chunk && (await loadListChunk(chunk)));
  };

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
    loadList();
  }, []);

  useEffect(() => {
    loadLibrary();
  }, [list]);

  return (
    <div className="flex min-h-full flex-col">
      {status === "loading" && <Loader />}
      {status === "ready" && (
        <>
          <div className="sticky top-0 left-0 right-0 bg-base-100 mb-5 z-[9999]">
            <div className="flex w-full items-center justify-between">
              <div className="tabs font-headings font-semibold">
                <button
                  className={`text-md tab tab-bordered ${
                    mode === "tracks" && "tab-active"
                  }`}
                  onClick={() => setMode("tracks")}
                >
                  Tracks
                </button>
                <button
                  className={`text-md tab tab-bordered ${
                    mode === "artists" && "tab-active"
                  }`}
                  onClick={() => setMode("artists")}
                >
                  Artists
                </button>
                <button
                  className={`text-md tab tab-bordered ${
                    mode === "albums" && "tab-active"
                  }`}
                  onClick={() => setMode("albums")}
                >
                  Albums
                </button>
                <button
                  className={`text-md tab tab-bordered ${
                    mode === "list" && "tab-active"
                  }`}
                  onClick={() => setMode("list")}
                >
                  List
                </button>
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
                <button
                  className="btn btn-sm gap-2 hidden"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <List mode={mode} library={libraryFiltered} handlePlay={handlePlay} />
        </>
      )}
    </div>
  );
};

export default Home;
