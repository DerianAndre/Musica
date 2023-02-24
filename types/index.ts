export interface Player {
  play: Function;
  pause: Function;
  seek: Function;
  duration: Function;
  mute: Function;
  volume: Function;
  loop: Function;
  stop: Function;
}

export type Library = {
  [key: string]: Artist;
};

export type Artist = {
  title: string;
  slug: string;
  albums: Album[];
};

export type Album = {
  slug: string;
  title: string;
  artist: string;
  albumartist: string;
  albumsort: string;
  year: string;
  originalyear: null;
  date: string;
  originaldate: null;
  genre: string[];
  cover: string;
  tracks: Track[];
};

export type Track = {
  slug: string;
  trackNo: number;
  track: string;
  artist: string;
  albumartist: string;
  artists: string[];
  album: string;
  title: string;
  genre: string[];
  year: null;
  container: string;
  codec: string;
  duration: number;
  bitrate: number;
  extension: string;
  path: string;
};

export type Playlist = {
  slug?: string;
  title?: string;
  tracks?: Track[];
};
