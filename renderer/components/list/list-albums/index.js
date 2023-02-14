import React from "react";
import ListAlbum from "./list-album";

const ListAlbums = ({ library, handlePlay }) => {
  if (!library) return;

  const objectKeys = Object.keys(library);

  return (
    <div className="list-albums">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 4xl:grid-cols-10 gap-10">
        {objectKeys?.map((artist) => (
          <React.Fragment key={artist}>
            {library[artist]?.albums?.map((album) => (
              <ListAlbum key={album.title} artist={artist} album={album} />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ListAlbums;
