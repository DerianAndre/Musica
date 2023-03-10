import { JSXElementConstructor } from 'react';
import { Artist, Album, Playlist, Track } from '../../types';

const formatBitrate = (
  sizeInBytes: number = 0,
  outputUnit: string = 'kbps',
): string => {
  const byteUnits = ['bps', 'kbps', 'Mbps', 'Gbps'];

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
  const mins = min < 10 ? `0${min}` : `${min}`;
  const secs = sec < 10 ? `0${sec}` : `${sec}`;
  return `${mins}:${secs}`;
};

const formatCountdown = (totalSeconds: number = 0) => {
  const min = Math.floor(totalSeconds / 60) || 0;
  const sec = Math.floor(totalSeconds % 60) || 0;
  const mins = min < 10 ? `0${min}` : `${min}`;
  const secs = sec < 10 ? `0${sec}` : `${sec}`;

  return (
    <>
      <span style={{ '--value': mins } as object}></span>:
      <span style={{ '--value': secs } as object}></span>
    </>
  );
};

const formatGenre = (genre?: string | string[]): string => {
  if (!genre) return '-';

  const gen = typeof genre === 'string' ? genre : genre.join(', ');

  return gen
    .replaceAll('/', ', ')
    .replaceAll(' & ', ', ')
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

  if (minutes < 60) {
    const mins = minutes === 1 ? 'min' : 'mins';
    const secs = seconds === 1 ? 'sec' : 'secs';
    return `${minutes} ${mins}${seconds === 0 ? '' : `, ${seconds} ${secs}`}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours < 24) {
    const hrs = hours === 1 ? 'hour' : 'hours';
    const mins = remainingMinutes === 1 ? 'min' : 'mins';
    const secs = seconds === 1 ? 'sec' : 'secs';
    return `${hours} ${hrs}, ${remainingMinutes} ${mins}${
      seconds === 0 ? '' : `, ${seconds} ${secs}`
    }`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  const dayStr = days === 1 ? 'day' : 'days';
  const hrs = remainingHours === 1 ? 'hour' : 'hours';
  const mins = remainingMinutes === 1 ? 'min' : 'mins';
  const secs = seconds === 1 ? 'sec' : 'secs';
  return `${days} ${dayStr}, ${remainingHours} ${hrs}, ${remainingMinutes} ${mins}${
    seconds === 0 ? '' : `, ${seconds} ${secs}`
  }`;
};

const formatTotal = (
  total: number = 0,
  plural: string,
  singular: string,
): string => {
  return `${total} ${total > 1 ? plural : singular}`;
};

const getAlbumPlaylist = (dataArtist: Artist, dataAlbum: Album): Playlist => ({
  slug: dataAlbum?.slug,
  title: dataArtist?.title,
  tracks: dataAlbum?.tracks,
});

const getArtistTotalAlbums = (artist?: Artist): number => {
  return artist?.albums?.length || 0;
};

const getArtistTotalDuration = (artist?: Artist): number => {
  return (
    artist?.albums?.reduce(
      (current, item) => current + getAlbumTotalDuration(item),
      0,
    ) || 0
  );
};

const getAudioQuality = (
  bitDepth?: number | null,
  sampleRate?: number | null,
  codec?: string | null,
): string => {
  if (!bitDepth || !sampleRate || !codec) return 'Unknown';

  const container = codec.split('/')[0].toLocaleLowerCase();

  const formatSpecs = {
    SD: {
      minBitDepth: 16,
      minSampleRate: 22050,
      minBitRate: 705600,
    },
    CD: {
      minBitDepth: 16,
      minSampleRate: 44100,
      minBitRate: 1411200,
    },
    'Hi-Res': {
      codec: ['flac', 'alac', 'wav', 'aiff'], // TODO
      minBitDepth: 24,
      minSampleRate: 48000, // or 96000 (?)
      minBitrate: 2304000,
    },
    DSD: {
      minBitDepth: 1,
      minSampleRate: 2822400,
      minBitrate: 1411000,
    },
    //MQA: {
    //  minBitDepth: 24,
    //  minSampleRate: 44100,
    // minBitrate: 2116800,
    //},
  };

  let audioQuality = 'Trash';

  Object.entries(formatSpecs).forEach(
    ([quality, { minBitDepth, minSampleRate }]) => {
      if (bitDepth >= minBitDepth && sampleRate >= minSampleRate) {
        audioQuality = quality;
      }
    },
  );

  return audioQuality;
};

const getArtistTotalTracks = (artist?: Artist): number => {
  return (
    artist?.albums?.reduce(
      (current: number, item: Album) => item?.tracks?.length + current,
      0,
    ) || 0
  );
};

const getAlbumTotalDuration = (album?: Album): number => {
  return (
    album?.tracks?.reduce(
      (current: number, item: Track) => current + item.duration,
      0,
    ) || 0
  );
};

const getAlbumTotalTracks = (album?: Album): number => {
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

const getImage = (cover?: string): string => {
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
  formatBitrate,
  formatCountdown,
  formatDuration,
  formatGenre,
  formatSamplerate,
  formatTotal,
  formatTotalTime,
  getAudioQuality,
  getAlbumPlaylist,
  getAlbumTotalDuration,
  getAlbumTotalTracks,
  getArtistTotalAlbums,
  getArtistTotalTracks,
  getArtistTotalDuration,
  getImage,
  sortAlbums,
};
