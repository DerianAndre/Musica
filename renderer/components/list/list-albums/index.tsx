import React, { useContext } from 'react';
import { PlayerContext } from '~/renderer/context';
import ListIntersection from '../list-intersecton';
import ListAlbum from './list-album';

const ListAlbums = () => {
  const { libraryAlbums } = useContext(PlayerContext);
  const albums = libraryAlbums;

  return (
    <div className="list-albums">
      <div className="align-stretch -mx-3 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 4xl:grid-cols-10">
        {albums?.map((album, index) => (
          <ListIntersection key={index + album.title}>
            <ListAlbum artist={album.albumartist} album={album} />
          </ListIntersection>
        ))}
      </div>
    </div>
  );
};

export default ListAlbums;
