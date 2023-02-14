import { lazy, Suspense } from "react";
import Loader from "../loader";

const List = ({ library, handlePlay, mode }) => {
  if (!library) return;

  const ListAll = lazy(() => import("./list-all"));
  const ListArtists = lazy(() => import("./list-artists"));
  const ListAlbums = lazy(() => import("./list-albums"));

  const components = {
    all: <ListAll library={library} handlePlay={handlePlay} />,
    artists: <ListArtists library={library} handlePlay={handlePlay} />,
    albums: <ListAlbums library={library} handlePlay={handlePlay} />,
    tracks: null,
  };

  return <Suspense fallback={<Loader />}>{components[mode]}</Suspense>;
};

export default List;
