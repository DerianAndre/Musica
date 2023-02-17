import React from "react";
import Link from "next/link";
import ListAll from "./list-all";
import ListArtists from "./list-artists";
import ListAlbums from "./list-albums";
import ListTracks from "./list-tracks";

const List = ({ library, handlePlay, mode }) => {
  if (!library) return;

  const librarySorted = Object.fromEntries(
    Object.entries(library).sort(([a], [b]) => a.localeCompare(b))
  );

  const components = {
    artists: <ListArtists library={librarySorted} handlePlay={handlePlay} />,
    albums: <ListAlbums library={librarySorted} handlePlay={handlePlay} />,
    tracks: <ListTracks library={librarySorted} handlePlay={handlePlay} />,
    list: <ListAll library={librarySorted} handlePlay={handlePlay} />,
  };

  return components[mode];
};

export default List;
