const getRandomArtist = (library) => {
  if (!library) return null;
  const keys = Object.keys(library);
  const randomArtist = keys[(keys.length * Math.random()) << 0];
  return library[randomArtist];
};

const getRandomAlbum = (artist) => {
  if (!artist) return null;
  const artistAlbums = artist.albums;
  const albumIndex = Math.floor(Math.random() * (artistAlbums?.length || 0));
  const randomAlbum = artistAlbums[albumIndex];
  return randomAlbum;
};

const getRandomTrack = (album) => {
  if (!album) return null;
  const trackIndex = Math.floor(Math.random() * (album?.tracks?.length || 0));
  const randomTrack = album.tracks[trackIndex];
  return randomTrack;
};

const handlePlayRandom = (library, handlePlay) => {
  const artist = getRandomArtist(library);
  const album = getRandomAlbum(artist);
  const track = getRandomTrack(album);

  try {
    handlePlay(track);
  } catch (error) {
    throw Error(error);
  }
};

export { getRandomArtist, getRandomAlbum, getRandomTrack, handlePlayRandom };
