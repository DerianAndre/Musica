import ListAll from "./list-all";
import ListArtists from "./list-artists";
import ListAlbums from "./list-albums";

const List = ({ library, handlePlay, mode, show = true }) => {
  if (!library) return;

  const list = {
    all: <ListAll library={library} handlePlay={handlePlay} />,
    artists: <ListArtists library={library} handlePlay={handlePlay} />,
    albums: <ListAlbums library={library} handlePlay={handlePlay} />,
    tracks: <></>,
  };

  return <>{show && list[mode]}</>;
};

export default List;
