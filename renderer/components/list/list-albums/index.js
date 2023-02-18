import React, { Fragment, lazy } from 'react';
import ListIntersection from '../list-intersecton';
import ListAlbum from './list-album';

const ListAlbums = ({ library }) => {
  if (!library) return;

  const albums = Object.values(library)
    .flatMap((item) => {
      return item.albums;
    })
    .sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });

  return (
    <div className="list-albums">
      <div className="align-stretch grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 4xl:grid-cols-10">
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
