'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Album, Artist, Library, Playlist } from '~/types';
import loadChunk from '~/library/chunks';
import ListIntersection from '~/renderer/components/list/list-intersecton';
import ListAllItem from '~/renderer/components/list/list-all/list-all-item/index';
import { PlayerContext } from '~/renderer/context';
import { MdPlayArrow } from 'react-icons/md';
import { shufflePlaylist } from '~/renderer/utils/random';
import { Shuffle } from '~/renderer/components/icons/index';
import PageCover from '~/renderer/components/page-cover';
import GoBack from '~/renderer/components/go-back';
import {
  formatTotal,
  formatTotalTime,
  getAlbumTotalDuration,
  getAlbumTotalTracks,
} from '~/renderer/utils';
import Link from 'next/link';

const PageArtist = ({
  params,
}: {
  params: { artist: string; album: string };
}) => {
  const { artist, album } = params;
  const { handlePlayPlaylist } = useContext(PlayerContext);

  const [dataArtist, setDataArtist] = useState<Artist>({
    title: 'Artist',
    slug: 'artist',
    albums: [],
  });

  const [dataAlbum, setDataAlbum] = useState<Album>();

  const [albumPlaylist, setAlbumPlaylist] = useState<Playlist>({
    title: 'Playlist',
    slug: 'playlist',
    tracks: [],
  });

  const totalDuration = getAlbumTotalDuration(dataAlbum);
  const totalTracks = getAlbumTotalTracks(dataAlbum);

  useEffect(() => {
    if (!artist || !album) return;

    const getArtistData = async () => {
      const data = await loadChunk({
        chunk: undefined,
        slug: artist,
        setter: undefined,
      });

      setDataArtist(data);

      const dataAlbum = data?.albums?.find(
        (item: Album) => item?.slug === album,
      );

      setDataAlbum(dataAlbum);

      const playlist: Playlist = {
        slug: album,
        title: data?.title,
        tracks: dataAlbum.tracks,
      };

      setAlbumPlaylist(playlist);
    };

    getArtistData();
  }, [artist, album]);

  return (
    <>
      <PageCover cover={dataAlbum?.cover} />

      <GoBack />

      <header>
        <h2 className="font-headings text-3xl font-semibold">
          {dataAlbum?.title}
        </h2>
        <div className="mb-3 flex gap-2 opacity-50">
          <div>
            <Link href={`/artist/${artist}`}>{dataArtist?.title}</Link>
          </div>
          <span>•</span>
          <div>{dataAlbum?.year}</div>
          <span>•</span>
          <div>{dataAlbum?.genre}</div>
          <span>•</span>
          <div>{formatTotal(totalTracks, 'tracks', 'track')}</div>
          <span>•</span>
          <div>{formatTotalTime(totalDuration)}</div>
        </div>
        <div className="flex gap-2">
          <button
            className="btn-sm btn gap-2"
            type="button"
            onClick={() => handlePlayPlaylist(albumPlaylist)}
          >
            <MdPlayArrow /> Play album
          </button>
          <button
            className="btn-sm btn gap-2"
            type="button"
            onClick={() => handlePlayPlaylist(shufflePlaylist(albumPlaylist))}
          >
            <Shuffle /> Play shuffle
          </button>
        </div>
      </header>

      <ListIntersection>
        <ListAllItem
          library={
            {
              [dataArtist?.title]: {
                albums: [dataAlbum],
              },
            } as Library
          }
          artist={dataArtist?.title}
          show={{ artist: false, info: false }}
        />
      </ListIntersection>
    </>
  );
};

export default PageArtist;
