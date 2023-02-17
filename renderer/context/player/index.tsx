import {
  createContext,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import loadLibrary from '~/library';

type PlayerContext = {
  tracks: object;
  library: object;
  libraryMemo: object;
  libraryStatus: string;
  setLibrary: Function;
  setLibraryStatus: Function;
};

const PlayerContext = createContext<PlayerContext>({
  tracks: {},
  library: {},
  libraryMemo: {},
  libraryStatus: 'loading',
  setLibrary: () => {},
  setLibraryStatus: () => {},
});

const PlayerProvider = (props: { children: ReactElement }) => {
  const [library, setLibrary] = useState<object>({});
  const [libraryStatus, setLibraryStatus] = useState<string>('loading');

  const libraryMemo = useMemo(() => {
    return Object.fromEntries(
      Object.entries(library).sort(([a], [b]) => a.localeCompare(b)),
    );
  }, [library]);

  const tracks = useMemo(() => {
    const result = [];
    for (const key in library) {
      const item = library[key];
      if (item.albums) {
        for (const album of item.albums) {
          if (album?.tracks) {
            for (const track of album.tracks) {
              result.push({ ...track, album: album.title });
            }
          }
        }
      }
    }
    result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [library]);

  useEffect(() => {
    loadLibrary({ setLibrary, setStatus: setLibraryStatus });
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        tracks,
        library,
        libraryMemo,
        libraryStatus,
        setLibrary,
        setLibraryStatus,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  );
};

export { PlayerContext, PlayerProvider };
