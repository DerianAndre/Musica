import React, { Fragment, useContext } from 'react';
import ListAllTrack from '../list-all-track';
import ListCover from '../../list-cover';
import ListIntersection from '../../list-intersecton';
import Link from 'next/link';
import {
  getAlbumPlaylist,
  getAlbumTotalDuration,
  getAlbumTotalTracks,
  sortAlbums,
} from '~/renderer/utils';
import { Album, Artist, Library } from '~/types';
import HeaderInfo from '~/renderer/components/header-info';
import { shufflePlaylist } from '~/renderer/utils/random';
import { PlayerContext } from '~/renderer/context';
import { PlayArrow, Shuffle } from '~/renderer/components/icons';

interface IProps {
  artist: Artist;
  album?: Album;
  show?: object;
}

const ListAllItem = ({ artist, album, show }: IProps) => {
  const display = { artist: true, info: true, ...show };
  const albums = sortAlbums(album ? [album] : artist?.albums);
  const { handlePlayPlaylist } = useContext(PlayerContext);

  return (
    <div className="list-all-item">
      {display.artist && (
        <h2 className="font-headings text-3xl font-semibold">
          <Link href={`/artist/${artist?.slug}`}>{artist.title}</Link>
        </h2>
      )}
      <div className="divide-y divide-black/[0.1] dark:divide-white/[0.05]">
        {albums?.map((album) => (
          <section id={album?.slug} key={album?.title}>
            <ListIntersection>
              <div className="flex flex-col flex-wrap gap-5 py-5 md:flex-row">
                <div className="w-[200px] flex-initial">
                  <Link href={`/artist/${artist?.slug}/${album?.slug}`}>
                    <ListCover album={album} width={'200px'} />
                  </Link>
                  <div className="mt-3 flex flex-col gap-2">
                    <button
                      className="btn-sm btn gap-2"
                      type="button"
                      onClick={() =>
                        handlePlayPlaylist(getAlbumPlaylist(artist, album))
                      }
                    >
                      <PlayArrow /> Play album
                    </button>
                    <button
                      className="btn-sm btn gap-2"
                      type="button"
                      onClick={() =>
                        handlePlayPlaylist(
                          shufflePlaylist(getAlbumPlaylist(artist, album)),
                        )
                      }
                    >
                      <Shuffle /> Play shuffle
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex-col truncate">
                  {display.info && (
                    <div className="list-info mb-3">
                      <h3 className="font-headings text-2xl font-semibold">
                        <Link href={`/artist/${artist?.slug}/${album?.slug}`}>
                          {album?.title}
                        </Link>
                      </h3>
                      <HeaderInfo
                        year={album?.year}
                        genre={album?.genre}
                        totalTracks={getAlbumTotalTracks(album)}
                        totalDuration={getAlbumTotalDuration(album)}
                      />
                    </div>
                  )}
                  <div className="
                    flex flex-col gap-1
                    [&>.item]:rounded
                    [&>.item:nth-child(odd)]:bg-black/[.065]
                    hover:[&>.item]:bg-black/[.125]
                    dark:[&>.item:nth-child(odd)]:bg-black/[.15]
                    dark:hover:[&>.item]:bg-black/[.30]
                  ">
                    {album?.tracks?.map((track) => (
                      <ListIntersection key={track?.path}>
                        <ListAllTrack track={track} />
                      </ListIntersection>
                    ))}
                  </div>
                </div>
              </div>
            </ListIntersection>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ListAllItem;
