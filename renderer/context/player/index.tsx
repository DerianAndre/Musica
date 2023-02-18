import {
  createContext,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import loadLibrary from '~/library';
import { Library, Track } from '~/types';

type PlayerContext = {
  library: Library;
  libraryMemo: Library;
  libraryStatus: string;
  playerMode: string;
  playlist: Track[];
  setLibrary: Function;
  setLibraryStatus: Function;
  setPlayerMode: Function;
  setPlaylist: Function;
  tracks: object;
};

const PlayerContext = createContext<PlayerContext>({
  library: {},
  libraryMemo: {},
  libraryStatus: 'loading',
  playerMode: 'normal',
  playlist: [],
  setLibrary: () => {},
  setLibraryStatus: () => {},
  setPlayerMode: () => {},
  setPlaylist: () => {},
  tracks: {},
});

const PlayerProvider = (props: { children: ReactElement }) => {
  const [library, setLibrary] = useState<{}>({});
  // TODO: To handle all tracks to be played
  const [playlist, setPlaylist] = useState<[]>([]);
  // TODO: Use to handle random mode from all, artist, album, or whatever
  const [playerMode, setPlayerMode] = useState<string>('normal');
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
        library,
        libraryMemo,
        libraryStatus,
        playerMode,
        playlist,
        setLibrary,
        setLibraryStatus,
        setPlayerMode,
        setPlaylist,
        tracks,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  );
};

export { PlayerContext, PlayerProvider };
