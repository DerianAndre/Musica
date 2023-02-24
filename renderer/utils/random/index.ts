import { handlePlay } from '~/renderer/components/player/utils';
import { Album, Artist, Library, Playlist, Track } from '~/types';

const getRandomArtist = (library: Library): Artist => {
  const keys = Object.keys(library);
  const randomArtist = keys[(keys.length * Math.random()) << 0];
  return library[randomArtist];
};

const getRandomAlbum = (artist: Artist): Album => {
  const artistAlbums = artist.albums;
  const albumIndex = Math.floor(Math.random() * (artistAlbums?.length || 0));
  const randomAlbum = artistAlbums[albumIndex];
  return randomAlbum;
};

const getRandomTracksPlaylist = (tracks: Track[]): Playlist => {
  const tracksCopy = [...tracks];
  const playlist: Playlist = {
    slug: 'random-tracks',
    title: 'Random tracks',
    tracks: shuffleTracks(tracksCopy).slice(0, 1000),
  };

  return playlist;
};

const getRandomTrack = (album: Album): Track => {
  const trackIndex = Math.floor(Math.random() * (album?.tracks?.length || 0));
  const randomTrack = album.tracks[trackIndex];
  return randomTrack;
};

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffledArray = new Array<T>(array.length);

  for (let i = 0; i < array.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    if (i !== j) {
      shuffledArray[i] = shuffledArray[j];
    }
    shuffledArray[j] = array[i];
  }

  return shuffledArray;
};

const shuffleTracks = (tracks: Track[]): Track[] => {
  return shuffleArray(tracks);
};

const shufflePlaylist = (playlist: Playlist): Playlist => {
  const tracks: Track[] = playlist.tracks || [];
  return {
    ...playlist,
    tracks: shuffleTracks(tracks),
  };
};

const handlePlayRandom = (library: Library): void => {
  const artist = getRandomArtist(library);
  const album = getRandomAlbum(artist);
  const track = getRandomTrack(album);

  try {
    handlePlay(track);
  } catch (error) {
    console.error(error);
  }
};

export {
  getRandomTracksPlaylist,
  getRandomArtist,
  getRandomAlbum,
  getRandomTrack,
  shuffleArray,
  shufflePlaylist,
  shuffleTracks,
  handlePlayRandom,
};
