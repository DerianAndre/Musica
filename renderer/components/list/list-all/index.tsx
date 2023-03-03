import React, { useContext } from 'react';
import { PlayerContext } from '~/renderer/context';
import { Artist } from '~/types';
import ListIntersection from '../list-intersecton';
import ListAllItem from './list-all-item';

const List = () => {
  const { libraryMemo, libraryArtists } = useContext(PlayerContext);

  return (
    <div className="list-all">
      {libraryArtists?.map((artist: Artist, index: number) => (
        <ListIntersection key={index + artist.slug}>
          <ListAllItem library={libraryMemo} artist={artist} />
          <div className="divider mt-5 mb-10" />
        </ListIntersection>
      ))}
    </div>
  );
};

export default List;
