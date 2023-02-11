"use client";

import "../scss/globals.scss";
import library from "../../library.json";

import React, { useState, useEffect } from "react";

const Home = () => {
  const [path, setPath] = useState("C:\\");

  // TODO: move to settings
  const handleSelectFolder = () => {
    window.electron.dialog.open();
  };

  const handlePlay = (file) => {
    window.electron.player.play(file);
  };

  useEffect(() => {
    // TODO: move to settings
    window.electron.dialog.on((event, data) => {
      if (data.path) {
        setPath(data.path);
      }
    });
  }, []);

  return (
    <div className="flex flex-col">
      <div className="div hidden">
        <button className="btn" onClick={handleSelectFolder}>
          Select Folder
        </button>
      </div>

      {
        // TODO: refactor
      }
      {Object.keys(library)?.map((artist) => (
        <div key={artist}>
          <h2 className="text-xl font-bold mb-3">{artist}</h2>
          {library[artist]?.albums.map((album, index) => (
            <div key={album.title}>
              <h3 className="text-lg">
                {album.title}{" "}
                <small className="opacity-30">({album.year})</small>
              </h3>
              <div className="flex flex-col mb-4">
                {album.tracks?.map((tracks) => (
                  <div
                    className="flex text-sm align-items-center align-bottom gap-3"
                    key={tracks.path}
                  >
                    <div className="flex-initial">
                      <button
                        className="btn btn-circle btn-ghost btn-xs"
                        onClick={() => handlePlay(tracks.path)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="flex-initial opacity-50">
                      {tracks.track}
                    </div>
                    <div className="flex-1">{tracks.title}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="divider" />
        </div>
      ))}
    </div>
  );
};

export default Home;
