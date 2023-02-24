'use client';
/* eslint-disable react-hooks/exhaustive-deps */
import {
  createContext,
  ReactNode,
  useEffect,
  useRef,
  useMemo,
  useState,
} from 'react';
import loadLibrary from '~/library';
import { Howl } from 'howler';
import { Player, Library, Playlist, Track } from '~/types';
import {
  getRandomTracksPlaylist,
  handlePlayRandom,
} from '~/renderer/utils/random/index';
import { handlePlay } from '~/renderer/components/player/utils';
import { PLAYER_STATES } from '~/renderer/components/player/constants';

interface HowlRef {
  current: Player | null;
}

interface PlayerContext {
  howl: HowlRef | null;
  sortBy: string;
  library: Library;
  libraryMemo: Library;
  libraryStatus: string;
  playerMode: string;
  playlist: Playlist;
  handlePlayPause: Function;
  handlePlayPrev: Function;
  handlePlayNext: Function;
  handlePlayMode: Function;
  handlePlayPlaylist: Function;
  setLibrary: Function;
  setLibraryStatus: Function;
  setPlayerState: Function;
  setPlayerMode: Function;
  setPlaylist: Function;
  setSortBy: Function;
  playerState: string;
  tracks: Track[];
}

interface IProps {
  children: ReactNode;
}

const PlayerContext = createContext<PlayerContext>(null!);

const PlayerProvider = ({ children }: IProps) => {
  const howl = useRef<Player | null>(null!);
  const [library, setLibrary] = useState<Library>({});
  const [libraryStatus, setLibraryStatus] = useState<string>('loading');
  const [playerMode, setPlayerMode] = useState<string>('normal');
  const [playerState, setPlayerState] = useState(PLAYER_STATES.STOP);
  const [playlist, setPlaylist] = useState<Playlist>({});
  const [playlistIndex, setPlaylistIndex] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('title');

  const player = howl.current;
  const shuffle = useRef(false);
  const repeat = useRef(false);

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
    if (mode === 'random-all') {
      handlePlayRandom(libraryMemo);
    }
    setPlayerMode(mode);
  };

  const handlePlayPlaylist = (playlist: Playlist): void => {
    if (!playlist || !playlist.tracks) return;

    setPlayerMode('playlist');
    setPlaylist(playlist);
    setPlaylistIndex(0);
    handlePlay(playlist?.tracks[0]);
  };

  const handlePlayPause = (): void => {
    if (playerState === PLAYER_STATES.STOP) {
      handlePlayPlaylist(getRandomTracksPlaylist(tracks));
      return;
    }

    if (!player) return;

    if (playerState !== PLAYER_STATES.PLAY) {
      player.play();
      setPlayerState(PLAYER_STATES.PLAY);
    } else {
      player.pause();
      setPlayerState(PLAYER_STATES.PAUSE);
    }
  };

  const handlePlayPrev = (): void => {
    if (
      !playlist ||
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
    if (
      !playlist ||
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

  const handleShuffle = () => {
    if (shuffle.current) {
      shuffle.current = false;
    } else {
      shuffle.current = true;
    }
  };

  const handleRepeat = () => {
    if (repeat.current) {
      repeat.current = false;
      howl?.current?.loop(false);
    } else {
      repeat.current = true;
      howl?.current?.loop(true);
    }
  };

  useEffect(() => {
    loadLibrary({ setLibrary, setStatus: setLibraryStatus });
  }, []);

  useEffect(() => {
    window.electron.player.metadata(
      (event: object, data: { metadata: { file: string } }) => {
        if (howl.current) howl.current.unload();

        howl.current = new Howl({
          autoplay: true,
          src: data.metadata.file || null,
          loop: repeat.current,
          onplay: () => {
            setPlayerState(PLAYER_STATES.PLAY);
            window.electron.player.event({ state: PLAYER_STATES.PLAY });
          },
          onpause: () => {
            setPlayerState(PLAYER_STATES.PAUSE);
            window.electron.player.event({ state: PLAYER_STATES.PAUSE });
          },
          onend: () => {
            setPlayerState(PLAYER_STATES.END);
            window.electron.player.event({ state: PLAYER_STATES.END });
          },
          onstop: () => {
            setPlayerState(PLAYER_STATES.STOP);
            window.electron.player.event({ state: PLAYER_STATES.STOP });
          },
          onmute: () => {},
          onvolume: () => {},
          onplayerror: (id: number, message: number) => {
            setPlayerState(PLAYER_STATES.ERROR);
            window.electron.player.event({
              state: PLAYER_STATES.ERROR,
              error: {
                id,
                message,
              },
            });
            console.error('player-play-error', { id, message });
          },
          onloaderror: (id: number, message: number) => {
            setPlayerState(PLAYER_STATES.ERROR);
            window.electron.player.event({
              state: PLAYER_STATES.ERROR,
              error: {
                id,
                message,
              },
            });
            console.error('player-load-error', { id, message });
          },
        });
      },
    );
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        handlePlayMode,
        handlePlayNext,
        handlePlayPause,
        handlePlayPlaylist,
        handlePlayPrev,
        howl,
        library,
        libraryMemo,
        libraryStatus,
        playerMode,
        playerState,
        playlist,
        setLibrary,
        setLibraryStatus,
        setPlayerMode,
        setPlayerState,
        setPlaylist,
        setSortBy,
        sortBy,
        tracks,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export { PlayerContext, PlayerProvider };
