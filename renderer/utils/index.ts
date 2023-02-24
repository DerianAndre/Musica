import { Album, Playlist, Track } from '../../types/index';

const timeFormat = (totalSeconds: number): string => {
  if (!totalSeconds) return '00:00';
  const min = Math.floor(totalSeconds / 60);
  const sec = Math.floor(totalSeconds % 60);
  const minutes = min < 10 ? `0${min}` : `${min}`;
  const seconds = sec < 10 ? `0${sec}` : `${sec}`;
  return `${minutes}:${seconds}`;
};

const sortAlbums = (albums: Album[]): Album[] => {
  return albums.sort((a: Album, b: Album) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });
};

const albumsToTracks = (albums: Album[]): Track[] => {
  return albums.reduce((acc: Track[], album: Album) => {
    return [...acc, ...album.tracks];
  }, []);
};

const getImage = (cover: string): string => {
  const skeleton =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  try {
    if (!cover) return skeleton;
    return require(`~/library/cache/${cover}`).default.src;
  } catch (error) {
    return skeleton;
  }
};

export { albumsToTracks, timeFormat, sortAlbums, getImage };
