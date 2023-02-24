import React from 'react';
import ListAll from './list-all';
import ListArtists from './list-artists';
import ListAlbums from './list-albums';
import ListTracks from './list-tracks';

const List = ({ library, tracks, mode }) => {
  if (!library) return;

  const components = {
    tracks: <ListTracks tracks={tracks} />,
    artists: <ListArtists library={library} />,
    albums: <ListAlbums library={library} />,
    list: <ListAll library={library} />,
  };

  return components[mode];
};

export default List;
