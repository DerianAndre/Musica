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
import loadLibrary, { loadList } from '~/library';
import { Howl } from 'howler';
import { List, Library, Playlist, Track } from '~/types';
import {
  getRandomTracksPlaylist,
  handlePlayRandom,
} from '~/renderer/utils/random/index';
import { handlePlay } from '~/renderer/components/player/utils';
import { PLAYER_STATES } from '~/renderer/components/player/constants';
import { useLocalStorage } from 'usehooks-ts';

interface HowlRef {
  current: Howl | null;
}

interface PlayerContext {
  howl: HowlRef;
  sortBy: string;
  list: List;
  listStatus: string;
  library: Library;
  libraryMemo: Library;
  libraryStatus: string;
  playerMuted: Boolean;
  playerMode: string;
  playlist: Playlist;
  search: string;
  handlePlayPause: Function;
  handlePlayPrev: Function;
  handlePlayNext: Function;
  handlePlayMode: Function;
  handlePlayPlaylist: Function;
  handleToggleMute: Function;
  setLibrary: Function;
  setLibraryStatus: Function;
  setPlayerState: Function;
  setPlayerMode: Function;
  setPlaylist: Function;
  setSortBy: Function;
  setSearch: Function;
  playerState: string;
  tracks: Track[];
}

interface IProps {
  children: ReactNode;
}

const PlayerContext = createContext<PlayerContext>(null!);

const PlayerProvider = ({ children }: IProps) => {
  const howl = useRef<Howl | null>(null!);
  const player = howl.current;
  const shuffle = useRef(false);
  const repeat = useRef(false);

  const [library, setLibrary] = useState<Library>({});
  const [list, setList] = useState<List>([]);
  const [listStatus, setListStatus] = useState<string>('loading');
  const [libraryStatus, setLibraryStatus] = useState<string>('loading');
  const [playerMuted, setPlayerMuted] = useLocalStorage<boolean>(
    'musica-player-muted',
    false,
  );
  const [playerMode, setPlayerMode] = useState<string>('normal');
  const [playerState, setPlayerState] = useState(PLAYER_STATES.STOP);
  const [playlist, setPlaylist] = useState<Playlist>({});
  const [playlistIndex, setPlaylistIndex] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('title');
  const [search, setSearch] = useState<string>('');
  const libraryMemo: Library = useMemo(() => {
    return Object.fromEntries(
      Object.entries(library)?.sort(([a], [b]) => a.localeCompare(b)),
    );
  }, [library]);

  const tracks: Track[] = useMemo(() => {
    const searchRegex = new RegExp(search, 'i');
    const filteredTracks: Track[] = [];

    for (const key in library) {
      const item = library[key];
      if (item.albums) {
        for (const album of item.albums) {
          if (album?.tracks) {
            for (const track of album.tracks) {
              if (
                !searchRegex.test(track.title) &&
                !searchRegex.test(album.title) &&
                !searchRegex.test(item.title)
              ) {
                continue;
              }
              filteredTracks.push({ ...track, album: album.title });
            }
          }
        }
      }
    }

    filteredTracks?.sort((a: Track, b: Track) => {
      if (sortBy === 'year') {
        return Number(b[sortBy]) - Number(a[sortBy]);
      }
      return Number(String(a[sortBy]).localeCompare(String(b[sortBy])));
    });

    return filteredTracks;
  }, [library, search, sortBy]);

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

  const handleToggleMute = () => {
    setPlayerMuted((v) => !v);
  };

  const handleToggleShuffle = () => {
    if (shuffle.current) {
      shuffle.current = false;
    } else {
      shuffle.current = true;
    }
  };

  const handleToggleRepeat = () => {
    if (repeat.current) {
      repeat.current = false;
      howl?.current?.loop(false);
    } else {
      repeat.current = true;
      howl?.current?.loop(true);
    }
  };

  useEffect(() => {
    loadLibrary({ setLibrary, setLibraryStatus });
    loadList({ setList, setListStatus });
  }, []);

  useEffect(() => {
    if (!player) return;
    player?.mute(playerMuted);
  }, [player, playerMuted]);

  useEffect(() => {
    window.electron.player.metadata(
      (event: object, data: { metadata: { file: string } }) => {
        if (howl.current) howl.current.unload();

        howl.current = new Howl({
          autoplay: true,
          src: data.metadata.file || [],
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
          onplayerror: (id, message) => {
            if (playerState !== PLAYER_STATES.PLAY) return;
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
          onloaderror: (id, message) => {
            if (playerState !== PLAYER_STATES.PLAY) return;
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
        handleToggleMute,
        howl,
        list,
        listStatus,
        library,
        libraryMemo,
        libraryStatus,
        playerMuted,
        playerMode,
        playerState,
        playlist,
        search,
        setLibrary,
        setLibraryStatus,
        setPlayerMode,
        setPlayerState,
        setPlaylist,
        setSearch,
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
