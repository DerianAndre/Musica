import React from "react";
import ListAlbum from "./list-album";

const ListAlbums = ({ library, handlePlay }) => {
  if (!library) return;

  const objectKeys = Object.keys(library);

  return (
    <div className="list-albums">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 3xl:grid-cols-10 4xl:grid-cols-12 gap-10">
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
