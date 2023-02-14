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

import { Howl } from "howler";
import { useInterval, useLocalStorage } from "usehooks-ts";
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

  const [trigger, setTrigger] = useState(0); // * Use to force rerender
  const [seek, setSeek] = useState(0);
  const [volume, setVolume] = useLocalStorage("volume", 1);
  const [state, setState] = useState(PLAYER_STATES.STOP);
  const [isMuted, setIsMuted] = useState(false);
  const [metadata, setMetadata] = useState(false);

  const playerArtImage = (object) => {
    if (object?.data) {
      return URL.createObjectURL(
        new Blob([object?.data], { type: object?.data?.format })
      );
    } else {
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    }
  };

  const playerReset = () => {
    if (!howl.current || state === PLAYER_STATES.PLAY) return;
    howl.current.stop();
    setDelay(null);
    setState(PLAYER_STATES.STOP);
    setSeek(0);
  };

  const timeFormat = (total) => {
    const min = Math.floor(total / 60);
    const sec = Math.floor(total % 60);
    const minutes = min < 10 ? `0${min}` : `${min}`;
    const seconds = sec < 10 ? `0${sec}` : `${sec}`;
    return `${minutes}:${seconds}`;
  };

  const timeCurrent = timeFormat(Math.floor(seek));

  const timeDuration = timeFormat(player?.duration() || 0);

  const volumeCurrent = (volume * 100).toFixed(0);

  const seekMap = (value) => {
    const duration = player?.duration() || 0;
    return ((value - 0) / (100 - 0)) * (duration - 0) + 0;
  };

  const sliderValue = seek > 0 ? (seek / player.duration()) * 100 : 0;

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
      player?.mute(true);
    } else {
      setIsMuted(false);
      player?.mute(false);
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

  const handleShuffle = () => {
    setTrigger((old) => old + 1);
    if (shuffle.current) {
      shuffle.current = false;
    } else {
      shuffle.current = true;
    }
  };

  const handleRepeat = () => {
    setTrigger((old) => old + 1);
    if (repeat.current) {
      repeat.current = false;
      player?.loop(false);
    } else {
      repeat.current = true;
      player?.loop(true);
    }
  };

  const handlePlayerUpdate = () => {
    if (player && state !== PLAYER_STATES.PLAY) return;
    setSeek(player?.seek());
  };

  useInterval(() => {
    handlePlayerUpdate();
  }, delay);

  useEffect(() => {
    window.electron.player.metadata((event, data) => {
      setMetadata(data);

      playerReset();

      howl.current = new Howl({
        autoplay: false,
        src: data?.file || null,
        volume,
        loop: repeat.current,
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
            //handlePlayRandom(library, handlePlay);
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
    <div className="player fixed bottom-0 left-0 right-0">
      <div className="px-10 py-5 w-full flex flex-col gap-2 backdrop-blur-md bg-base-300/50 dark:bg-base-300/75">
        <div className="track flex gap-6 mb-2">
          <div className="flex flex-none items-center justify-start">
            <span className="text-xs">{timeCurrent}</span>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <input
              ref={sliderTime}
              type="range"
              value={sliderValue}
              min={0}
              max={100}
              step={0.05}
              className="range range-xs w-full"
              onChange={handleSliderTime}
            />
          </div>
          <div className="flex flex-none items-center justify-end">
            <span className="text-xs">{timeDuration}</span>
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
                <div className="text-sm opacity-50">{volumeCurrent}%</div>
                <input
                  className="range range-xs min-w-[75px] max-w-[125px]"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  ref={sliderVolume}
                  value={volume}
                  onChange={handleSliderVolume}
                />
              </div>
            )}

            <button
              className="btn-mute-toggle btn btn-circle btn-ghost btn-sm text-xl"
              onClick={handleMute}
            >
              {volume <= 0.05 || isMuted ? <VolumeOff /> : <VolumeUp />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
