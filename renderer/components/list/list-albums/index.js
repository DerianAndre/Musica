import React, { Fragment, lazy } from "react";
import ListIntersection from "../list-intersecton";

const ListAlbum = lazy(() => import("./list-album"));

const ListAlbums = ({ library, handlePlay }) => {
  if (!library) return;

  const objectKeys = Object.keys(library);

  return (
    <div className="list-albums">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 4xl:grid-cols-10 gap-10">
        {objectKeys?.map((artist) => (
          <Fragment key={artist}>
            {library[artist]?.albums?.map((album) => (
              <ListIntersection key={album.title}>
                <ListAlbum
                  artist={artist}
                  album={album}
                  handlePlay={handlePlay}
                />
              </ListIntersection>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ListAlbums;
