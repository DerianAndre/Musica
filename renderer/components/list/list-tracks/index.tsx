import React, { useContext } from 'react';
import ListIntersection from '../list-intersecton';
import ListTrack from './list-track';
import { Track } from '~/types';
import { PlayerContext } from '~/renderer/context';

const ListTracks = () => {
  const { libraryTracks } = useContext(PlayerContext);

  return (
    <div className="list-tracks">
      <div className="
        align-stretch grid grid-cols-1 gap-1
        [&>.item]:rounded
        [&>.item:nth-child(odd)]:bg-black/[.065]
        hover:[&>.item]:bg-black/[.125]
        dark:[&>.item:nth-child(odd)]:bg-black/[.15]
        dark:hover:[&>.item]:bg-black/[.30]
      ">
        {libraryTracks?.map((track: Track, index: number) => (
          <ListIntersection key={index + track?.path}>
            <ListTrack track={track} />
          </ListIntersection>
        ))}
      </div>
    </div>
  );
};

export default ListTracks;
