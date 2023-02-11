"use client";

import "./styles.module.scss";

import React, { useState, useEffect, useRef } from "react";
import { Howl, Howler } from "howler";
import { useInterval } from "usehooks-ts";

const PLAYER_STATES = {
  PLAY: "PLAY",
  PAUSE: "PAUSE",
  STOP: "STOP",
};

const Player = () => {
  const sliderTime = useRef(null);
  const sliderVolume = useRef(null);
  const howl = useRef(null);
  const player = howl?.current || null;

  const [delay, setDelay] = useState(null);

  const [loop, setLoop] = useState(false);
  const [seek, setSeek] = useState(0);
  const [volume, setVolume] = useState(100);
  const [state, setState] = useState(PLAYER_STATES.STOP);
  const [isMuted, setIsMuted] = useState(false);
  const [path, setPath] = useState("C:\\");
  const [metadata, setMetadata] = useState(false);

  useInterval(() => {
    handlePlayerUpdate();
  }, delay);

  const playerArtImage = (object) => {
    if (object?.data) {
      return URL.createObjectURL(
        new Blob([object?.data], { type: object?.data?.format })
      );
    } else {
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    }
  };

  const handleSliderTime = (event) => {
    if (!player || state !== PLAYER_STATES.PLAY) return;

    const value = event.target.value;
    const currentSeek = seekMap(value);

    setSeek(player.seek());
    player.seek(currentSeek);
  };

  const handleSliderVolume = (event) => {
    if (!player) return;

    const value = event.target.value;

    setVolume(value);
    player.volume(value);
  };

  const handleMute = () => {
    if (!player) return;

    if (!isMuted) {
      setIsMuted(true);
      player.mute(true);
    } else {
      setIsMuted(false);
      player.mute(false);
    }
  };

  const handlePlayPause = () => {
    if (!metadata || !player) return;

    if (state === PLAYER_STATES.PAUSE) {
      setState(PLAYER_STATES.PLAY);
      player.play();
    } else {
      setState(PLAYER_STATES.PAUSE);
      player.pause();
    }
  };

  const handleLoop = () => {
    if (!metadata || !howl.current) return;

    if (!loop) {
      setLoop(true);
      player.loop(true);
    } else {
      setVolume(100);
      player.mute(false);
    }
  };

  const timeCurrent = (seek) => {
    timeCurrent = timeFormat(Math.floor(seek));
    return timeCurrent;
  };

  const timeDuration = () => {
    return timeFormat(player?.duration() || 0);
  };

  const timeFormat = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };

  const seekMap = (value) => {
    const duration = player?.duration() || 0;
    return ((value - 0) / (100 - 0)) * (duration - 0) + 0;
  };

  const sliderValue = () => (seek > 0 ? (seek / player.duration()) * 100 : 0);

  const handleReset = () => {
    if (!howl.current || state === PLAYER_STATES.PLAY) return;
    howl.current.stop();
    setDelay(null);
    setState(PLAYER_STATES.STOP);
    setSeek(0);
  };

  const handlePlayerUpdate = () => {
    if (player && state !== PLAYER_STATES.PLAY) return;
    console.log(state, seek);
    setSeek(player?.seek());
  };

  useEffect(() => {
    window.electron.dialog.on((event, data) => {
      if (data?.path) {
        setPath(data.path);
      }
    });

    window.electron.player.metadata((event, data) => {
      setMetadata(data);

      handleReset();

      howl.current = new Howl({
        autoplay: true,
        src: data?.file || null,
        onplay: () => {
          setState(PLAYER_STATES.PLAY);
          setDelay(100); // Starts the useInterval to 100ms
        },
        onpause: () => {
          setState(PLAYER_STATES.PAUSE);
          setDelay(null); // Stops the useInterval
        },
        onend: () => {
          setState(PLAYER_STATES.STOP);
        },
        onstop: () => {
          setState(PLAYER_STATES.STOP);
        },
        onvolume: () => {
          setVolume(howl.current.volume());
          sliderVolume.current.value === howl.current.volume();
        },
      });
    });
  }, []);

  return (
    <div className="fixed player w-full flex flex-col gap-2 p-3 backdrop-blur-sm bg-black/30 bottom-0 left-0">
      <div className="track flex gap-6 mb-2">
        <div className="flex flex-none items-center justify-start">
          {timeFormat(seek)}
        </div>
        <div className="flex flex-1 items-center justify-center">
          <input
            ref={sliderTime}
            type="range"
            value={sliderValue()}
            min="0"
            max="100"
            step="0.5"
            className="range range-xs w-full"
            onChange={handleSliderTime}
          />
        </div>
        <div className="flex flex-none items-center justify-end">
          {timeDuration()}
        </div>
      </div>

      <div className="player flex w-full gap-5">
        <div className="track-info flex flex-1 items-center justify-start gap-3">
          <figure className="art select-none swap">
            <img
              className={`d-block rounded-sm max-w-none ${
                state === PLAYER_STATES.PLAY && "shadow-inner"
              }`}
              src={playerArtImage(metadata?.common?.picture?.[0])}
              width="75px"
              height="75px"
            />
          </figure>
          {metadata?.common?.title && (
            <div className="info font-display">
              <h2 className="font-bold text-xl">{metadata?.common?.title}</h2>
              <h3 className="text-sm text-clip text-ellipsis opacity-60">
                <span>{metadata?.common?.artist}</span>
                <span> • </span>
                <span>{metadata?.common?.album}</span>
              </h3>
            </div>
          )}
        </div>

        <div className="main-controls flex flex-1 items-center justify-center gap-2">
          <button className="btn-prev btn btn-ghost btn-circle">
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
          <button
            className="btn-play btn btn-circle btn-outline border-2"
            onClick={handlePlayPause}
          >
            {state === PLAYER_STATES.PLAY ? (
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
          <button className="btn-next btn btn-ghost btn-circle">
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

        <div className="secondary-controls flex flex-1 items-center justify-end gap-3">
          {metadata && (
            <input
              ref={sliderVolume}
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={1}
              className="range range-xs min-w-[100px] max-w-[150px]"
              onChange={handleSliderVolume}
            />
          )}

          <button
            className="btn-mute-toggle btn btn-circle btn-sm"
            onClick={handleMute}
          >
            {volume < 0.01 || isMuted ? (
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
