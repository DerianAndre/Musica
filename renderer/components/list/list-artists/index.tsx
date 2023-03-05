import React, { useContext } from 'react';
import { PlayerContext } from '~/renderer/context';
import ListIntersection from '../list-intersecton';
import ListArtist from './list-artist';
import { Artist } from '~/types';

interface IProps {
  single?: boolean;
}

const ListArtists = ({ single }: IProps) => {
  const { libraryArtists } = useContext(PlayerContext);

  return (
    <div className="list-artists">
      <div className="-mx-3 grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 4xl:grid-cols-10">
        {libraryArtists?.map((artist: Artist, index: number) => (
          <ListIntersection key={index + artist.slug}>
            <ListArtist artist={artist} single={single} />
          </ListIntersection>
        ))}
      </div>
    </div>
  );
};

export default ListArtists;
