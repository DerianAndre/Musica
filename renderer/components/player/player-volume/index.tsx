'use client';

import { Howl } from 'howler';
import React, { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { VolumeOff, VolumeUp } from '../../icons';

interface IProps {
  player: Howl | null;
  playerMuted: Boolean;
  playerState: string;
  handleToggleMute: React.MouseEventHandler;
}

const PlayerVolume = ({
  player,
  playerState,
  playerMuted,
  handleToggleMute,
}: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [playerVolume, setPlayerVolume] = useLocalStorage<number>(
    'musica-player-volume',
    1,
  );

  const volumePercentage: string = isLoading
    ? (playerVolume * 100).toFixed(0)
    : '100';

  const handleSliderVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.valueAsNumber;

    setPlayerVolume(value);
    player?.volume(value);
  };

  useEffect(() => {
    if (!player) return;
    player?.volume(playerVolume);
  }, [player, playerState, playerVolume]);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  return (
    <>
      <div className="slider-volume flex items-center gap-2 opacity-0 transition ease-in hover:opacity-100">
        <div className="text-sm opacity-50">{volumePercentage}%</div>
        <label className="hidden" htmlFor="player-volume">
          Player volume
        </label>
        <input
          id="player-volume"
          className="range range-xs min-w-[75px] max-w-[125px]"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={playerVolume}
          onChange={handleSliderVolume}
        />
      </div>

      <button
        title="Toggle mute"
        type="button"
        className="btn-mute-toggle btn-ghost btn-sm btn-circle btn text-xl"
        onClick={handleToggleMute}
      >
        {playerVolume > 0 && !playerMuted ? <VolumeUp /> : <VolumeOff />}
      </button>
    </>
  );
};

export default PlayerVolume;
