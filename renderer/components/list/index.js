import React, { Suspense } from 'react';
import Link from 'next/link';
import ListAll from './list-all';
import ListArtists from './list-artists';
import ListAlbums from './list-albums';
import ListTracks from './list-tracks';

const List = ({ library, tracks, mode, handlePlay }) => {
  if (!library) return;

  /*   const librarySorted = Object.fromEntries(
    Object.entries(library).sort(([a], [b]) => a.localeCompare(b))
  ); */

  const components = {
    tracks: (
      <Suspense fallback={<>loading</>}>
        <ListTracks library={library} tracks={tracks} handlePlay={handlePlay} />
      </Suspense>
    ),
    artists: <ListArtists library={library} handlePlay={handlePlay} />,
    albums: <ListAlbums library={library} handlePlay={handlePlay} />,
    list: <ListAll library={library} handlePlay={handlePlay} />,
  };

  return components[mode];
};

export default List;
