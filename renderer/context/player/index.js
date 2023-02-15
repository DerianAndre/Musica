import { createContext, useEffect, useMemo, useState } from "react";
import list from "../../../library/list.json";

const PlayerContext = createContext();

const PlayerProvider = (props) => {
  const [libraryStatus, setLibraryStatus] = useState("loading");
  const [library, setLibrary] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const libraryMemo = useMemo(() => library, [library]);

  const libraryFiltered = useMemo(() => {
    if (!libraryMemo || !searchTerm) {
      return libraryMemo;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return Object.entries(libraryMemo).reduce((filtered, [artist, object]) => {
      if (!object.albums) return;

      const filteredAlbums = object.albums?.filter((album) => {
        if (
          artist?.toLowerCase().includes(lowerCaseSearchTerm) ||
          album?.title.toLowerCase().includes(lowerCaseSearchTerm)
        ) {
          return true;
        }
        return album?.tracks.some((track) =>
          track?.title?.toLowerCase().includes(lowerCaseSearchTerm)
        );
      });

      // todo filter tracks
      if (filteredAlbums?.length && filtered) {
        filtered[artist] = {
          albums: filteredAlbums,
        };
      }
      //console.log(filtered);

      return filtered;
    }, {});
  }, [libraryMemo]);

  const loadListChunk = async (chunk) => {
    if (!chunk || !Object.keys(chunk).length) return;

    return new Promise((resolve, reject) => {
      import(`./../../../library/chunks/${chunk.file}.json`)
        .then((data) => {
          console.log(data);
          setLibrary((old) => ({ ...old, [chunk.artist]: data?.default }));
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLibraryStatus("ready");
        });
    });
  };

  const loadLibrary = async () => {
    if (!list || !Object.keys(list).length) return;
    list.forEach(async (chunk) => chunk && (await loadListChunk(chunk)));
    setLibraryStatus("ready");
  };

  useEffect(() => {
    loadLibrary();
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        library,
        libraryStatus,
        libraryMemo,
        libraryFiltered,
        searchTerm,
        setSearchTerm,
        setLibrary,
        setLibraryStatus,
        setTrigger,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  );
};

export { PlayerContext, PlayerProvider };
