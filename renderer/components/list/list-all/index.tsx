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
        <>
          <ListIntersection key={index + artist?.slug}>
            <section id={artist?.slug}>
              <ListAllItem artist={artist} />
            </section>
            <div className="divider -mx-5 mt-5 mb-10" />
          </ListIntersection>
        </>
      ))}
    </div>
  );
};

export default List;
