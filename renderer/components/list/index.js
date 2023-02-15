import { lazy, Suspense } from "react";
import ListAll from "./list-all";
import ListArtists from "./list-artists";
import ListAlbums from "./list-albums";
import ListTracks from "./list-tracks";

const List = ({ library, handlePlay, mode }) => {
  if (!library) return;

  const components = {
    artists: <ListArtists library={library} handlePlay={handlePlay} />,
    albums: <ListAlbums library={library} handlePlay={handlePlay} />,
    tracks: <ListTracks library={library} handlePlay={handlePlay} />,
    list: <ListAll library={library} handlePlay={handlePlay} />,
  };

  return components[mode];
};

export default List;
