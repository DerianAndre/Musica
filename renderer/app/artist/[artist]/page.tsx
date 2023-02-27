'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Artist, Playlist } from '~/types';
import loadChunk from '~/library/chunks';
import ListIntersection from '~/renderer/components/list/list-intersecton';
import ListAllItem from '~/renderer/components/list/list-all/list-all-item/index';
import { PlayerContext } from '~/renderer/context';
import { MdPlayArrow } from 'react-icons/md';
import {
  albumsToTracks,
  formatTotal,
  formatTotalTime,
  getArtistTotalAlbums,
  getArtistTotalDuration,
  getArtistTotalTracks,
  sortAlbums,
} from '~/renderer/utils';
import { Shuffle } from '~/renderer/components/icons/index';
import { shufflePlaylist } from '~/renderer/utils/random';
import PageCover from '~/renderer/components/page-cover';
import GoBack from '~/renderer/components/go-back/index';

interface IProps {
  params: { artist: string };
}

const PageArtist = ({ params }: IProps) => {
  const { artist } = params;
  const { library, list, handlePlayPlaylist } = useContext(PlayerContext);

  const listArtist = list.find((item) => item.slug === artist);
  const dataArtist = library[listArtist?.artist || ''];

  const artistPlaylist: Playlist = {
    slug: artist,
    title: dataArtist?.title,
    tracks: albumsToTracks(sortAlbums(dataArtist?.albums)),
  };

  const totalAlbums = getArtistTotalAlbums(dataArtist);
  const totalTracks = getArtistTotalTracks(dataArtist);
  const totalDuration = getArtistTotalDuration(dataArtist);

  return (
    <>
      <PageCover cover={dataArtist?.albums[0]?.cover} />
      <GoBack />
      <header>
        <h2 className="font-headings text-3xl font-semibold">
          {dataArtist.title}
        </h2>
        <div className="mb-3 flex gap-2 opacity-50">
          <div>{formatTotal(totalAlbums, 'albums', 'album')}</div>
          <span>•</span>
          <div>{formatTotal(totalTracks, 'tracks', 'track')}</div>
          <span>•</span>
          <div>{formatTotalTime(totalDuration)}</div>
        </div>
        <div className="flex gap-2">
          <button
            className="btn-sm btn gap-2"
            type="button"
            onClick={() => handlePlayPlaylist(artistPlaylist)}
          >
            <MdPlayArrow /> Play artist
          </button>
          <button
            className="btn-sm btn gap-2"
            type="button"
            onClick={() => handlePlayPlaylist(shufflePlaylist(artistPlaylist))}
          >
            <Shuffle /> Play shuffle
          </button>
        </div>
      </header>
      <ListIntersection>
        <ListAllItem
          library={{ [dataArtist.title]: dataArtist }}
          artist={dataArtist.title}
          show={{ artist: false }}
        />
      </ListIntersection>
    </>
  );
};

export default PageArtist;
