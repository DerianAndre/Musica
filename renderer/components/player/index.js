"use client";

import "./styles.module.scss";

import React, { useState, useEffect, useRef } from "react";
import {
  RepeatOn,
  RepeatOff,
  Pause,
  Play,
  ShuffleOn,
  ShuffleOff,
  SkipNext,
  SkipPrevious,
  VolumeOff,
  VolumeUp,
} from "../icons";

import { Howl, Howler } from "howler";
import { useInterval } from "usehooks-ts";
import { handlePlayRandom } from "../../utils/random";

const PLAYER_STATES = {
  PLAY: "PLAY",
  PAUSE: "PAUSE",
  STOP: "STOP",
};

const Player = ({ library }) => {
  const sliderTime = useRef(null);
  const sliderVolume = useRef(null);
  const howl = useRef(null);
  const player = howl?.current || null;

  const [delay, setDelay] = useState(null);

  const shuffle = useRef(false);
  const repeat = useRef(false);

  const [seek, setSeek] = useState(0);
  const [volume, setVolume] = useState(1);
  const [state, setState] = useState(PLAYER_STATES.STOP);
  const [isMuted, setIsMuted] = useState(false);
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

  const handlePlay = (file) => {
    window.electron.player.play(file);
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

  // TODO
  const handlePlayPrev = () => {};

  // TODO
  const handlePlayNext = () => {};

  // TODO Fix
  const handleShuffle = () => {
    if (shuffle.current) {
      shuffle.current = false;
    } else {
      shuffle.current = true;
    }
  };

  // TODO Fix
  const handleRepeat = () => {
    if (repeat.current) {
      repeat.current = false;
      player?.loop(false);
    } else {
      repeat.current = true;
      player?.loop(true);
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

  const playerReset = () => {
    if (!howl.current || state === PLAYER_STATES.PLAY) return;
    howl.current.stop();
    setDelay(null);
    setState(PLAYER_STATES.STOP);
    setSeek(0);
  };

  const handlePlayerUpdate = () => {
    if (player && state !== PLAYER_STATES.PLAY) return;
    setSeek(player?.seek());
  };

  useEffect(() => {
    window.electron.player.metadata((event, data) => {
      setMetadata(data);

      playerReset();

      howl.current = new Howl({
        autoplay: false,
        src: data?.file || null,
        volume,
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
          if (shuffle.current) {
            handlePlayRandom(library, handlePlay);
          }
        },
        onstop: () => {
          setState(PLAYER_STATES.STOP);
        },
        onvolume: () => {
          setVolume(howl.current.volume());
          sliderVolume.current.value === howl.current.volume();
        },
      });

      setTimeout(() => {
        howl.current.play();
      }, 0);
    });
  }, []);

  return (
    <div className="fixed player w-full flex flex-col gap-2 p-3 backdrop-blur-md bg-black/50 bottom-0 left-0">
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
          <button
            className="btn-shuffle btn btn-ghost btn-circle btn-sm text-xl"
            onClick={handleShuffle}
          >
            {shuffle.current ? <ShuffleOn /> : <ShuffleOff />}
          </button>
          <button className="btn-prev btn btn-ghost btn-circle btn-sm text-3xl">
            <SkipPrevious />
          </button>
          <button
            className="btn-play btn btn-circle btn-md text-4xl btn-outline border-[3px]"
            onClick={handlePlayPause}
          >
            {state === PLAYER_STATES.PLAY ? <Pause /> : <Play />}
          </button>
          <button className="btn-next btn btn-ghost btn-circle btn-sm text-3xl">
            <SkipNext />
          </button>
          <button
            className="btn-loop btn btn-ghost btn-circle btn-sm text-xl"
            onClick={handleRepeat}
          >
            {repeat.current ? <RepeatOn /> : <RepeatOff />}
          </button>
        </div>

        <div className="secondary-controls flex flex-1 items-center justify-end gap-2 group">
          {metadata && (
            <div className="slider-volume flex items-center opacity-0 hover:opacity-100 gap-2 transition ease-in">
              <div className="text-sm opacity-50">
                {(player.volume() * 100).toFixed(0)}%
              </div>
              <input
                ref={sliderVolume}
                type="range"
                min="0"
                max="1"
                step="0.01"
                defaultValue={1}
                className="range range-xs min-w-[75px] max-w-[125px]"
                onChange={handleSliderVolume}
              />
            </div>
          )}

          <button
            className="btn-mute-toggle btn btn-circle btn-ghost btn-sm text-xl"
            onClick={handleMute}
          >
            {volume < 0.01 || isMuted ? <VolumeOff /> : <VolumeUp />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;
