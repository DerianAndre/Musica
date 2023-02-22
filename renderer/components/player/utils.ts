import { Track } from '~/types';

const handlePlay = (data: Track): void => {
  window.electron.player.play(data);
};

export { handlePlay };
