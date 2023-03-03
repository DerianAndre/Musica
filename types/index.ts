export interface Player {
  duration: Function;
  load: Function;
  loop: Function;
  mute: Function;
  off: Function;
  on: Function;
  once: Function;
  pause: Function;
  play: Function;
  playing: Function;
  seek: Function;
  state: Function;
  stop: Function;
  unload: Function;
  volume: Function;
}

export type List = ListItem[];

export type ListItem = {
  artist: string;
  file: string;
  path: string;
  [key: string]: any;
};

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
  year: string | number | null;
  originalyear: string | number | null;
  date: string;
  originaldate: string | null;
  genre: string[];
  cover: string;
  tracks: Track[];
  [key: string]: any;
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
  year: string | number | null;
  container: string;
  codec: string;
  duration: number;
  bitRate: number;
  sampleRate: number;
  extension: string;
  path: string;
  [key: string]: any;
};

export type Playlist = {
  slug?: string;
  title?: string;
  tracks?: Track[];
  [key: string]: any;
};
