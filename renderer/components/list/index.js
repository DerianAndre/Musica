import { lazy, Suspense } from "react";
import ListAll from "./list-all";
import ListArtists from "./list-artists";
import ListAlbums from "./list-albums";

const List = ({ library, handlePlay, mode }) => {
  if (!library) return;

  const components = {
    artists: <ListArtists library={library} handlePlay={handlePlay} />,
    albums: <ListAlbums library={library} handlePlay={handlePlay} />,
    tracks: <div>WIP</div>,
    list: <ListAll library={library} handlePlay={handlePlay} />,
  };

  return components[mode];
};

export default List;
