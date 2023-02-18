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
  background: string;
  sortBy: string;
  library: Library;
  libraryMemo: Library;
  libraryStatus: string;
  playerMode: string;
  playlist: Track[];
  setBackground: Function;
  setLibrary: Function;
  setLibraryStatus: Function;
  setPlayerMode: Function;
  setPlaylist: Function;
  setSortBy: Function;
  tracks: object;
};

const PlayerContext = createContext<PlayerContext>({
  background: '',
  sortBy: 'title',
  library: {},
  libraryMemo: {},
  libraryStatus: 'loading',
  playerMode: 'normal',
  playlist: [],
  setSortBy: () => {},
  setBackground: () => {},
  setLibrary: () => {},
  setLibraryStatus: () => {},
  setPlayerMode: () => {},
  setPlaylist: () => {},
  tracks: {},
});

const PlayerProvider = (props: { children: ReactElement }) => {
  const [library, setLibrary] = useState<Library>({});
  const [sortBy, setSortBy] = useState<string>('title');
  // TODO: To handle all tracks to be played
  const [playlist, setPlaylist] = useState<[]>([]);
  // TODO: Use to handle random mode from all, artist, album, or whatever
  const [playerMode, setPlayerMode] = useState<string>('normal');
  const [libraryStatus, setLibraryStatus] = useState<string>('loading');
  const [background, setBackground] = useState<string>('');

  const libraryMemo: Library = useMemo(() => {
    return Object.fromEntries(
      Object.entries(library)?.sort(([a], [b]) => a.localeCompare(b)),
    );
  }, [library]);

  const tracks: Track[] = useMemo(() => {
    const result: Track[] = [];
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
    result?.sort((a, b) => {
      // TODO fix TS
      if (sortBy === 'year') {
        return b[sortBy] - a[sortBy];
      }
      return String(a[sortBy || 'title'])?.localeCompare(
        String(b[sortBy || 'title']),
      );
    });
    return result;
  }, [library, sortBy]);

  useEffect(() => {
    loadLibrary({ setLibrary, setStatus: setLibraryStatus });
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        background,
        sortBy,
        library,
        libraryMemo,
        libraryStatus,
        playerMode,
        playlist,
        setBackground,
        setLibrary,
        setLibraryStatus,
        setPlayerMode,
        setPlaylist,
        setSortBy,
        tracks,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  );
};

export { PlayerContext, PlayerProvider };
