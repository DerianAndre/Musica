/* eslint-disable react-hooks/exhaustive-deps */
import styles from './index.module.scss';

import React, { useContext, useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import Link from 'next/link';

import {
  RepeatOn,
  RepeatOff,
  PlayPause,
  ShuffleOn,
  ShuffleOff,
  SkipNext,
  SkipPrevious,
  VolumeOff,
  VolumeUp,
  Settings,
} from '../icons';
import { useInterval, useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import PlayerInfo from './player-info/index';
import PlayerSeeker from './player-seeker';
import PLAYER_STATES from './constants';
import ToggleTheme from '../theme-toggle';
import { PlayerContext } from '~/renderer/context';

const Player = () => {
  const { playerMode, playRandom, handlePlayNext, handlePlayPrev } =
    useContext(PlayerContext);
  const sliderTime = useRef(null);
  const sliderVolume = useRef(null);
  const howl = useRef(null);
  const player = howl?.current || null;
  const blurEnabled = useReadLocalStorage('musica-blur-enabled');
  const [blur, setBlur] = useState(null);
  const [delay, setDelay] = useState(null);

  const shuffle = useRef(false);
  const repeat = useRef(false);
  const mute = useRef(false);
  const [isMute, setIsMute] = useState(false); // ! For some reason state doesnt work in howler it must use a ref.current value in order to work...

  const [trigger, setTrigger] = useState(false); // * Use to force rerender
  const [seek, setSeek] = useState(0);
  const [volume, setVolume] = useLocalStorage('volume', 1);
  const [state, setState] = useState(PLAYER_STATES.STOP);
  const [data, setData] = useState(false);

  const playerReset = () => {
    if (!howl.current || state === PLAYER_STATES.PLAY) return;
    howl?.current?.stop();
    howl.current = null;
    setDelay(null);
    setState(PLAYER_STATES.STOP);
    setSeek(0);
  };

  const sliderValue = seek > 0 ? (seek / player.duration()) * 100 : 0;

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

  const reRender = () => {
    setTrigger((v) => !v);
  };

  const handleSliderTime = (event) => {
    if (!player) return;

    const value = event.target.value;
    const currentSeek = seekMap(value);

    setSeek(player.seek());
    player.seek(currentSeek);
  };

  const handleSliderVolume = (event) => {
    const value = event.target.value;

    setVolume(value);
    if (player) player.volume(value);
  };

  const handleMute = () => {
    setIsMute((old) => {
      mute.current = !old;
      player?.mute(!old);
      return !old;
    });
  };

  const handlePlay = (data, file) => {
    window.electron.player.play({ data, file });
  };

  const handlePlayPause = () => {
    if (!data || !player) return;

    if (state !== PLAYER_STATES.PLAY) {
      setState(PLAYER_STATES.PLAY);
      player.play();
    } else {
      setState(PLAYER_STATES.PAUSE);
      player.pause();
    }
  };

  const handleShuffle = () => {
    if (shuffle.current) {
      shuffle.current = false;
    } else {
      shuffle.current = true;
    }
    reRender();
  };

  const handleRepeat = () => {
    if (repeat.current) {
      repeat.current = false;
      player?.loop(false);
    } else {
      repeat.current = true;
      player?.loop(true);
    }
    reRender();
  };

  const handlePlayerUpdate = () => {
    if (player && state !== PLAYER_STATES.PLAY) return;
    // TODO change to ref to prevent re-renders
    setSeek(player?.seek());
  };

  useInterval(() => {
    handlePlayerUpdate();
  }, delay);

  useEffect(() => {
    window.electron.player.metadata((event, data) => {
      playerReset();
      setData(data);

      howl.current = new Howl({
        autoplay: false,
        src: data?.metadata?.file || null,
        mute: mute.current,
        loop: repeat.current,
        volume,
        onplay: () => {
          window.electron.player.event(PLAYER_STATES.PLAY);
          setState(PLAYER_STATES.PLAY);
          setDelay(100); // Starts the useInterval to 100ms
        },
        onpause: () => {
          window.electron.player.event(PLAYER_STATES.PAUSE);
          setState(PLAYER_STATES.PAUSE);
          setDelay(null); // Stops the useInterval
        },
        onend: () => {
          window.electron.player.event(PLAYER_STATES.END);
          setState(PLAYER_STATES.STOP);
          setSeek(0);
          player?.seek(0);
          console.log(playerMode);
          if (playerMode === 'random-all') {
            playRandom();
          }
          if (playerMode === 'playlist') {
            handlePlayNext();
          }
          if (shuffle.current) {
            playRandom();
          }
        },
        onstop: () => {
          window.electron.player.event(PLAYER_STATES.STOP);
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

    // TODO Manage global events
    //window.electron.player.on((event, payload) => {
    //
    //})
  }, []);

  useEffect(() => {
    setBlur(blurEnabled);
  }, [blurEnabled]);

  return (
    <div className={styles.player}>
      <div
        className={`flex w-full flex-col gap-2 p-5 ${
          blur ? styles['backdrop-true'] : styles['backdrop-false']
        }`}
      >
        <PlayerSeeker
          sliderTime={sliderTime}
          sliderValue={sliderValue}
          timeCurrent={timeCurrent}
          timeDuration={timeDuration}
          handleSliderTime={handleSliderTime}
        />

        <div className="player flex w-full flex-wrap gap-5">
          <div className="flex-1">
            <PlayerInfo state={state} data={data} />
          </div>

          <div className="main-controls flex flex-1 items-center justify-end gap-2 md:justify-center">
            <button
              className="btn-shuffle btn-ghost btn-sm btn-circle btn text-xl"
              onClick={handleShuffle}
            >
              {shuffle.current ? <ShuffleOn /> : <ShuffleOff />}
            </button>
            <button
              className="btn-prev btn-ghost btn-sm btn-circle btn text-3xl"
              onClick={handlePlayPrev}
            >
              <SkipPrevious />
            </button>
            <button
              className="btn-play btn-md btn-circle btn border-0 text-4xl shadow-lg"
              onClick={handlePlayPause}
            >
              <PlayPause state={state} />
            </button>
            <button
              className="btn-next btn-ghost btn-sm btn-circle btn text-3xl"
              onClick={handlePlayNext}
            >
              <SkipNext />
            </button>
            <button
              className="btn-loop btn-ghost btn-sm btn-circle btn text-xl"
              onClick={handleRepeat}
            >
              {repeat.current ? <RepeatOn /> : <RepeatOff />}
            </button>
          </div>

          <div className="secondary-controls group hidden flex-1 items-center justify-end gap-1 md:flex">
            {data && (
              <div className="slider-volume flex items-center gap-2 opacity-0 transition ease-in hover:opacity-100">
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
              className="btn-mute-toggle btn-ghost btn-sm btn-circle btn text-xl"
              onClick={handleMute}
            >
              {volume > 0 && !isMute ? <VolumeUp /> : <VolumeOff />}
            </button>
            <ToggleTheme />
            <Link
              className="btn-settings btn-ghost btn-sm btn-circle btn text-xl"
              href="/settings"
            >
              <Settings />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
