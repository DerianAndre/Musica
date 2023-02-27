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

interface IProps {
  params: { artist: string; album: string };
}

const PageArtist = ({ params }: IProps) => {
  const { artist, album } = params;
  const { library, list, handlePlayPlaylist } = useContext(PlayerContext);

  const listArtist = list.find((item) => item.slug === artist);
  const dataArtist = library[listArtist?.artist || ''];
  const dataAlbum = dataArtist?.albums?.find((item) => item.slug === album);
  const totalDuration = getAlbumTotalDuration(dataAlbum);
  const totalTracks = getAlbumTotalTracks(dataAlbum);

  const albumPlaylist: Playlist = {
    slug: album,
    title: dataArtist?.title,
    tracks: dataAlbum?.tracks,
  };

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
          <div>{String(dataAlbum?.year)}</div>
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
