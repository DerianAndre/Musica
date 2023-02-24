import styles from './index.module.scss';

import React, { useEffect, useRef, useState } from 'react';
import { timeFormat } from '~/renderer/utils';
import { PLAYER_STATES } from '../constants';
import { Player } from '~/types';
import { useInterval } from 'usehooks-ts';

interface IProps {
  player: Player | null;
  playerState: string;
}

const PlayerSeeker = ({ player, playerState }: IProps) => {
  const [playerDelay, setPlayerDelay] = useState<number | null>(null);
  const [playerSeek, setPlayerSeek] = useState<number>(0);

  const sliderValue: number = player
    ? playerSeek > 0
      ? (playerSeek / player?.duration()) * 100
      : 0
    : 0;

  const timeCurrent = timeFormat(Math.floor(playerSeek));

  const timeDuration = timeFormat(player?.duration() || 0);

  const customStyle: object = {
    '--slider-value': `${String(sliderValue)}%`,
  };

  const playerSeekMap = (value: number): number => {
    const duration = player?.duration() || 0;
    return ((value - 0) / (100 - 0)) * (duration - 0) + 0;
  };

  const handleSliderTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.valueAsNumber;
    const currentSeek = playerSeekMap(value);
    setPlayerSeek(currentSeek);
    player?.seek(currentSeek);
  };

  useInterval(() => {
    setPlayerSeek(player?.seek());
  }, playerDelay);

  useEffect(() => {
    playerState === PLAYER_STATES.PLAY && setPlayerDelay(100);
    playerState === PLAYER_STATES.PAUSE && setPlayerDelay(null);
    if (playerState === PLAYER_STATES.END) {
      setPlayerDelay(null);
      setPlayerSeek(0);
    }
  }, [playerState]);

  return (
    <div className="player-seeker mb-3">
      <div className="flex">
        <div className="flex w-14 items-center justify-start">
          <span className="block font-headings text-xs font-medium">
            {timeCurrent}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className={styles.slider} style={customStyle}>
            <label className="hidden" htmlFor="slider">
              Time slider
            </label>
            <input
              id="slider"
              className="w-full"
              type="range"
              value={sliderValue}
              min={0}
              max={100}
              step={0.05}
              onChange={handleSliderTime}
            />
          </div>
        </div>
        <div className="flex w-14 items-center justify-end">
          <span className="block font-headings text-xs font-medium">
            {timeDuration}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerSeeker;
