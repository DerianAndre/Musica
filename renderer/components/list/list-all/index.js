import React, { lazy } from "react";
import ListIntersection from "../list-intersecton";

const ListAllItem = lazy(() => import("./list-all-item"));

const List = ({ library, handlePlay }) => {
  if (!library) return;

  const objectKeys = Object.keys(library);

  return (
    <div className="list-all">
      {objectKeys?.length > 0 &&
        objectKeys?.map((artist) => (
          <ListIntersection key={artist}>
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
