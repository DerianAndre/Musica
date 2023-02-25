import React, { lazy } from 'react';
import { Artist, Library } from '~/types';
import ListIntersection from '../list-intersecton';
import ListAllItem from './list-all-item';

const List = ({ library }: { library: Library }) => {
  if (!library) return <></>;

  const artists = Object.keys(library);

  return (
    <div className="list-all">
      {artists?.map((artist, index) => (
        <ListIntersection key={index + artist}>
          <ListAllItem library={library} artist={artist} />
          <div className="divider mt-5 mb-10" />
        </ListIntersection>
      ))}
    </div>
  );
};

export default List;
