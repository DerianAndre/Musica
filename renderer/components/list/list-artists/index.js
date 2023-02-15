import React from "react";
import ListIntersection from "../list-intersecton";
import ListArtist from "./list-artist";

const ListArtists = ({ library, handlePlay }) => {
  if (!library) return;

  const artists = Object.keys(library);

  return (
    <div className="list-artists">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 4xl:grid-cols-10 gap-10">
        {artists?.map((artist) => (
          <ListIntersection key={artist}>
            <ListArtist artist={artist} data={library[artist]} />
          </ListIntersection>
        ))}
      </div>
    </div>
  );
};

export default ListArtists;
