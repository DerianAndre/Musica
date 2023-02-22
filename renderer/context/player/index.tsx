import {
  createContext,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import loadLibrary from '~/library';
import { Library, Playlist, Track } from '~/types';
import { handlePlayRandom } from '~/renderer/utils/random';
import { handlePlay } from '~/renderer/components/player/utils';

type PlayerContext = {
  background: string;
  sortBy: string;
  library: Library;
  libraryMemo: Library;
  libraryStatus: string;
  playerMode: string;
  playlist: Playlist;
  playRandom: Function;
  handlePlayPrev: Function;
  handlePlayNext: Function;
  handlePlayMode: Function;
  handlePlayPlaylist: Function;
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
  playlist: {},
  playRandom: () => {},
  handlePlayMode: () => {},
  handlePlayPlaylist: () => {},
  handlePlayPrev: () => {},
  handlePlayNext: () => {},
  setSortBy: () => {},
  setBackground: () => {},
  setLibrary: () => {},
  setLibraryStatus: () => {},
  setPlayerMode: () => {},
  setPlaylist: () => {},
  tracks: {},
});

const PlayerProvider = (props: { children: ReactElement }) => {
  const [background, setBackground] = useState<string>('');
  const [library, setLibrary] = useState<Library>({});
  const [libraryStatus, setLibraryStatus] = useState<string>('loading');
  const [playerMode, setPlayerMode] = useState<string>('normal');
  const [playlist, setPlaylist] = useState<Playlist>({});
  const [playlistIndex, setPlaylistIndex] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('title');

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

  const handlePlayMode = (mode: string): void => {
    console.log('mode', mode);
    if (mode === 'random-all') {
      handlePlayRandom(libraryMemo);
    }
    setPlayerMode(mode);
  };

  const handlePlayPlaylist = (playlist: Playlist): void => {
    setPlayerMode('playlist');
    setPlaylist(playlist);
    setPlaylistIndex(0);
    handlePlay(playlist?.tracks[0]);
  };

  /*   const handlePlay = (track: Track): void => {
    // handlePlay
    // should have index if is from album
  }; */

  const handlePlayPrev = (): void => {
    console.log(playerMode);
    if (playerMode === 'random-all') {
      playRandom();
      return;
    }
    if (
      !playlist.tracks ||
      playlist.tracks.length === 0 ||
      playlist.tracks.length === 1
    )
      return;
    const playlistLength = playlist?.tracks?.length - 1;
    if (playlistIndex === 0) {
      setPlaylistIndex(playlistLength);
      handlePlay(playlist?.tracks[playlistLength]);
    } else {
      setPlaylistIndex((index) => index - 1);
      handlePlay(playlist?.tracks[playlistIndex]);
    }
  };

  const handlePlayNext = (): void => {
    if (playerMode === 'random-all') {
      playRandom();
      return;
    }
    if (
      !playlist.tracks ||
      playlist.tracks.length === 0 ||
      playlist.tracks.length === 1
    )
      return;
    const playlistLength = playlist?.tracks?.length - 1;
    if (playlistIndex === playlistLength) {
      handlePlay(playlist?.tracks[0]);
      setPlaylistIndex(0);
    } else {
      handlePlay(playlist?.tracks[playlistIndex + 1]);
      setPlaylistIndex((index) => index + 1);
    }
  };

  const handlePlaylistRandom = (): void => {
    // Create a big playlist with random tracks and play it
  };

  const playRandom = (): void => {
    handlePlayRandom(library);
  };

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
        playRandom,
        handlePlayMode,
        handlePlayPlaylist,
        setBackground,
        setLibrary,
        setLibraryStatus,
        handlePlayPrev,
        handlePlayNext,
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
