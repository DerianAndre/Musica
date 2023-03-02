import { Artist, Album, Playlist, Track } from '../../types/index';

const formatBitrate = (
  sizeInBytes: number = 0,
  outputUnit: string = 'kb/s',
): string => {
  const byteUnits = ['b/s', 'kb/s', 'Mb/s', 'Gb/s', 'Tb/s'];

  const byteUnitIndex = byteUnits.indexOf(outputUnit);

  if (byteUnitIndex === -1) {
    throw new Error(`Invalid output unit: ${outputUnit}`);
  }

  let i = 0;
  let fileSize = sizeInBytes;
  while (fileSize >= 1024 && i < byteUnits.length - 1) {
    fileSize /= 1024;
    i++;
  }

  const value = fileSize.toFixed();
  const unit = byteUnits[i];

  return `${value} ${unit}`;
};

const formatDuration = (totalSeconds: number = 0): string => {
  if (!totalSeconds) return '00:00';
  const min = Math.floor(totalSeconds / 60);
  const sec = Math.floor(totalSeconds % 60);
  const minutes = min < 10 ? `0${min}` : `${min}`;
  const seconds = sec < 10 ? `0${sec}` : `${sec}`;
  return `${minutes}:${seconds}`;
};

const formatGenre = (genre: string | string[] | undefined): string => {
  return !genre
    ? 'Unkown genre'
    : typeof genre === 'string'
    ? genre.replaceAll('/', ', ').replaceAll(' , ', ', ').replaceAll(';', ', ')
    : genre
        .join(', ')
        .replaceAll('/', ', ')
        .replaceAll(' , ', ', ')
        .replaceAll(';', ', ');
};

const formatSamplerate = (
  frequencyInHertz: number = 0,
  outputUnit: string = 'Hz',
): string => {
  if (frequencyInHertz < 0) {
    throw new Error('Frequency must be non-negative');
  }

  const hertzUnits = ['Hz', 'kHz', 'MHz', 'GHz'];
  const hertzUnitIndex = hertzUnits.indexOf(outputUnit);

  if (hertzUnitIndex === -1) {
    throw new Error(`Invalid output unit: ${outputUnit}`);
  }

  let i = 0;
  let frequency = frequencyInHertz;

  while (frequency >= 1000 && i < hertzUnits.length - 1) {
    frequency /= 1000;
    i++;
  }

  const value = frequency.toFixed(1);
  const unit = hertzUnits[i];

  return `${value} ${unit}`;
};

const formatTotalTime = (durationInSeconds: number = 0): string => {
  if (durationInSeconds < 0) {
    throw new Error('Duration must be non-negative');
  }

  if (durationInSeconds < 60) {
    const seconds = durationInSeconds === 1 ? 'sec' : 'secs';
    return `${Math.round(durationInSeconds)} ${seconds}`;
  }

  const totalSeconds = Math.round(durationInSeconds);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    const secs = seconds === 1 ? 'sec' : 'secs';
    return `${seconds} ${secs}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hrs = hours === 1 ? 'hour' : 'hours';
  const mins = remainingMinutes === 1 ? 'min' : 'mins';
  const secs = seconds === 1 ? 'sec' : 'secs';

  if (hours === 0) {
    return `${remainingMinutes} ${mins}${
      seconds === 0 ? '' : `, ${seconds} ${secs}`
    }`;
  }

  return `${hours} ${hrs}, ${remainingMinutes} ${mins}${
    seconds === 0 ? '' : `, ${seconds} ${secs}`
  }`;
};

const isHiRes = (
  bitDepth: number | undefined | null,
  sampleRate: number | undefined | null,
  codec: string | undefined | null,
) => {
  if (!bitDepth || !sampleRate || !codec) return false;

  const acceptedFormats = ['wav', 'flac', 'alac', 'aiff', 'dsd'];

  //if (!acceptedFormats.includes(codec.toLowerCase())) return false;

  const minBitDepth = 24;
  const minSampleRate = 96000; // 44100

  return bitDepth >= minBitDepth && sampleRate >= minSampleRate;
};

const formatTotal = (
  total: number | undefined = 0,
  plural: string,
  singular: string,
): string => {
  return `${total} ${total > 1 ? plural : singular}`;
};

const getArtistTotalAlbums = (artist: Artist | undefined): number => {
  return artist?.albums?.length || 0;
};

const getArtistTotalDuration = (artist: Artist | undefined): number => {
  return (
    artist?.albums?.reduce(
      (current, item) => current + getAlbumTotalDuration(item),
      0,
    ) || 0
  );
};

const getArtistTotalTracks = (artist: Artist | undefined): number => {
  return (
    artist?.albums?.reduce(
      (current: number, item: Album) => item?.tracks?.length + current,
      0,
    ) || 0
  );
};

const getAlbumTotalDuration = (album: Album | undefined): number => {
  return (
    album?.tracks?.reduce(
      (current: number, item: Track) => current + item.duration,
      0,
    ) || 0
  );
};

const getAlbumTotalTracks = (album: Album | undefined): number => {
  return album?.tracks?.length || 0;
};

const sortAlbums = (albums: Album[]): Album[] => {
  return albums?.sort((a: Album, b: Album) => {
    if (a?.title < b?.title) {
      return -1;
    }
    if (a?.title > b?.title) {
      return 1;
    }
    return 0;
  });
};

const albumsToTracks = (albums: Album[]): Track[] => {
  return albums?.reduce((acc: Track[], album: Album) => {
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

export {
  albumsToTracks,
  isHiRes,
  formatBitrate,
  formatDuration,
  formatGenre,
  formatSamplerate,
  formatTotal,
  formatTotalTime,
  getAlbumTotalDuration,
  getAlbumTotalTracks,
  getArtistTotalAlbums,
  getArtistTotalTracks,
  getArtistTotalDuration,
  getImage,
  sortAlbums,
};
