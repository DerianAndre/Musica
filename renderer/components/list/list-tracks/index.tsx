import React, { useContext } from 'react';
import ListIntersection from '../list-intersecton';
import ListTrack from './list-track';
import { Track } from '~/types';
import { PlayerContext } from '~/renderer/context';

const ListTracks = () => {
  const { libraryTracks } = useContext(PlayerContext);

  return (
    <div className="list-tracks">
      <div className="align-stretch grid grid-cols-1 gap-1 [&>.item:nth-child(odd)]:bg-base-200 [&>.item]:rounded hover:[&>.item]:bg-base-300">
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
