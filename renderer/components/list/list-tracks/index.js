import React from 'react';
import ListIntersection from '../list-intersecton';
import ListTrack from './list-track';
import { handlePlay } from '~/renderer/components/player/utils';

const ListTracks = ({ tracks }) => {
  if (!tracks) return <></>;

  return (
    <div className="list-tracks">
      <div className="align-stretch grid grid-cols-1 gap-1 [&>.item:nth-child(odd)]:bg-base-200 [&>.item]:rounded hover:[&>.item]:bg-base-300">
        {tracks?.map((track, index) => (
          <ListIntersection key={index + track?.path}>
            <ListTrack track={track} handlePlay={handlePlay} />
          </ListIntersection>
        ))}
      </div>
    </div>
  );
};

export default ListTracks;
