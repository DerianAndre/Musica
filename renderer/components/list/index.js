import { lazy, Suspense } from "react";
import Loader from "../loader";

const List = ({
  library,
  handlePlay,
  mode,
  status,
  setStatus,
  show = true,
}) => {
  if (!library) return;

  const ListAll = lazy(() => import("./list-all"));
  const ListArtists = lazy(() => import("./list-artists"));
  const ListAlbums = lazy(() => import("./list-albums"));
  const list = {
    all: <ListAll library={library} handlePlay={handlePlay} />,
    artists: <ListArtists library={library} handlePlay={handlePlay} />,
    albums: <ListAlbums library={library} handlePlay={handlePlay} />,
    tracks: <></>,
  };

  return <Suspense fallback={Loader}>{show && list[mode]}</Suspense>;
};

export default List;
