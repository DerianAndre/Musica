/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import styles from './index.module.scss';

import React, { useContext, useState, useEffect, useRef } from 'react';

import {
  RepeatOn,
  RepeatOff,
  PlayPause,
  ShuffleOn,
  ShuffleOff,
  SkipNext,
  SkipPrevious,
} from '../icons';
import { useEventListener, useReadLocalStorage } from 'usehooks-ts';
import PlayerInfo from './player-info';
import PlayerSeeker from './player-seeker';
import { PLAYER_STATES } from './constants';
import ToggleTheme from '../theme-toggle';
import { PlayerContext } from '~/renderer/context';
import PlayerVolume from './player-volume';

const Player = () => {
  const {
    howl,
    playerState,
    playerMuted,
    handlePlayPause,
    handlePlayNext,
    handlePlayPrev,
    handleToggleMute,
  } = useContext(PlayerContext);

  const player = howl?.current || null;

  const blurEnabled = useReadLocalStorage<boolean>(
    'musica-settings-blur',
  ) as boolean;
  const [blur, setBlur] = useState<boolean>(false);
  const shuffle = useRef<boolean>(false);
  const repeat = useRef<boolean>(false);

  const [trigger, setTrigger] = useState<boolean>(false); // * Use to force rerender
  const [data, setData] = useState<object | null>(null!);

  const reRender = () => {
    setTrigger((v) => !v);
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

  const onKeyDown = (event: KeyboardEvent) => {
    if (event?.target instanceof HTMLInputElement) return;

    const ACTIONS: {
      [key: string]: Function;
    } = {
      KeyM: () => handleToggleMute(),
      MediaTrackPrevious: () => handlePlayPrev(),
      MediaTrackNext: () => handlePlayNext(),
      MediaPlayPause: () => handlePlayPause(),
      Space: () => handlePlayPause(),
    };

    return ACTIONS[event.code] && ACTIONS[event.code]();
  };

  useEventListener('keydown', onKeyDown);

  useEffect(() => {
    window.electron.player.metadata((event: any, data: object) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    if (playerState === PLAYER_STATES.END) {
      handlePlayNext();
    }
  }, [playerState]);

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
        <PlayerSeeker player={player} playerState={playerState} />

        <div className="player flex w-full gap-5">
          <div className="player-info w-[350px] flex-1 truncate">
            <PlayerInfo data={data} />
          </div>

          <div className="player-controls mx-auto flex flex-none items-center justify-end gap-2 md:justify-center">
            <button
              type="button"
              title="Shuffle"
              className="btn-shuffle btn-ghost btn-sm btn-circle btn hidden text-xl sm:flex"
              onClick={() => handleShuffle()}
            >
              {shuffle.current ? <ShuffleOn /> : <ShuffleOff />}
            </button>
            <button
              type="button"
              title="Previous"
              className="btn-prev btn-ghost btn-sm btn-circle btn text-3xl"
              onClick={() => handlePlayPrev()}
            >
              <SkipPrevious />
            </button>
            <button
              type="button"
              title={playerState === PLAYER_STATES.PAUSE ? 'Play' : 'Pause'}
              className="btn-play btn-md btn-circle btn border-0 text-4xl shadow-lg"
              onClick={() => handlePlayPause()}
            >
              <PlayPause state={playerState} />
            </button>
            <button
              type="button"
              title="Next"
              className="btn-next btn-ghost btn-sm btn-circle btn text-3xl"
              onClick={() => handlePlayNext()}
            >
              <SkipNext />
            </button>
            <button
              type="button"
              title="Repeat"
              className="btn-loop btn-ghost btn-sm btn-circle btn hidden text-xl sm:flex"
              onClick={() => handleRepeat()}
            >
              {repeat.current ? <RepeatOn /> : <RepeatOff />}
            </button>
          </div>

          <div className="player-secondary-controls group hidden w-[350px] flex-1 items-center justify-end gap-1 truncate md:flex">
            <PlayerVolume
              player={player}
              playerState={playerState}
              playerMuted={playerMuted}
              handleToggleMute={handleToggleMute as React.MouseEventHandler}
            />
            <ToggleTheme />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
