"use client";

import "./styles.module.scss";

import React, { useState, useEffect } from "react";

const Player = () => {
  const [volume, setVolume] = useState(100);
  const [status, setStatus] = useState("pause");
  const [path, setPath] = useState("C:\\");
  const [metadata, setMetadata] = useState(false);

  const playerImage = (object) => {
    if (object?.data) {
      return URL.createObjectURL(
        new Blob([object?.data], { type: object?.data?.format })
      );
    } else {
      return "";
    }
  };

  useEffect(() => {
    window.electron.dialog.on((event, data) => {
      if (data.path) {
        setPath(data.path);
      }
    });

    window.electron.player.metadata((event, data) => {
      console.log(data);
      setMetadata(data);
    });
  }, []);

  return (
    <div className="player flex flex-col gap-2">
      <div className="track flex gap-6 mb-2">
        <div className="flex flex-none items-center justify-start">
          00:02:00
        </div>
        <div className="flex flex-1 items-center justify-center">
          <input
            type="range"
            min="0"
            max="100"
            className="range range-xs w-full"
          />

          {metadata && metadata.file && metadata.format && (
            <audio>
              <source src={metadata?.file} type="audio/flac" />
            </audio>
          )}
        </div>
        <div className="flex flex-none items-center justify-end">00:02:00</div>
      </div>
      <div className="player flex w-full gap-10">
        <div className="track-info flex flex-1 items-center justify-start gap-5">
          <figure className="art">
            <img
              src={playerImage(metadata?.common?.picture?.[0])}
              width="100px"
              height="100px"
            />
          </figure>
          <div className="info">
            <h2>{metadata?.common?.title}</h2>
            <h3>
              {metadata?.common?.artist} - {metadata?.common?.album}
            </h3>
          </div>
        </div>

        <div className="main-controls flex flex-1 items-center justify-center gap-2">
          <button className="btn btn-circle btn-prev">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z"
              />
            </svg>
          </button>
          <button className="btn btn-circle btn-outline border-2 btn-play">
            {status === "playing" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                />
              </svg>
            )}
          </button>
          <button className="btn btn-circle btn-next">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
              />
            </svg>
          </button>
        </div>
        <div className="secondary-controls flex flex-1 items-center justify-end gap-5">
          <button className="btn btn-circle btn-sm">
            {volume === 0 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;
