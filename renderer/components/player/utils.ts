import { Track } from '~/types';

const timeFormat = (total: number): string => {
  const min = Math.floor(total / 60);
  const sec = Math.floor(total % 60);
  const minutes = min < 10 ? `0${min}` : `${min}`;
  const seconds = sec < 10 ? `0${sec}` : `${sec}`;
  return `${minutes}:${seconds}`;
};

const handlePlay = (data: Track): void => {
  window.electron.player.play(data);
};

export { handlePlay, timeFormat };
