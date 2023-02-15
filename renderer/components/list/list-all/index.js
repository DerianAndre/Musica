import React, { lazy } from "react";
import ListIntersection from "../list-intersecton";

const ListAllItem = lazy(() => import("./list-all-item"));

const List = ({ library, handlePlay }) => {
  if (!library) return;

  const artists = Object.keys(library).sort((a, b) => a - b);

  return (
    <div className="list-all">
      {artists?.map((artist, index) => (
        <ListIntersection key={index + artist}>
          <ListAllItem
            library={library}
            artist={artist}
            handlePlay={handlePlay}
          />
        </ListIntersection>
      ))}
    </div>
  );
};

export default List;
