import React from 'react';
import ListIntersection from '../list-intersecton';
import ListTrack from './list-track';

const ListTracks = ({ library, tracks, handlePlay }) => {
  if (!tracks) return;

  return (
    <div className="list-tracks">
      <div className="align-stretch grid grid-cols-1 gap-1">
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
