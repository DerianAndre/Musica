'use client';

import React, { useContext } from 'react';
import { Playlist } from '~/types';
import ListIntersection from '~/renderer/components/list/list-intersecton';
import ListAllItem from '~/renderer/components/list/list-all/list-all-item';
import { PlayerContext } from '~/renderer/context';
import { MdPlayArrow } from 'react-icons/md';
import {
  albumsToTracks,
  getArtistTotalAlbums,
  getArtistTotalDuration,
  getArtistTotalTracks,
  sortAlbums,
} from '~/renderer/utils';
import { Shuffle } from '~/renderer/components/icons';
import { shufflePlaylist } from '~/renderer/utils/random';
import PageCover from '~/renderer/components/page-cover';
import GoBack from '~/renderer/components/go-back';
import HeaderInfo from '~/renderer/components/header-info';

interface IProps {
  params: {
    artist: string;
  };
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
      <PageCover album={dataArtist?.albums[0]} />
      <GoBack />
      <header>
        <h2 className="font-headings text-3xl font-semibold">
          {dataArtist?.title}
        </h2>
        <HeaderInfo
          totalAlbums={totalAlbums}
          totalTracks={totalTracks}
          totalDuration={totalDuration}
        />
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
        <ListAllItem artist={dataArtist} show={{ artist: false }} />
      </ListIntersection>
    </>
  );
};

export default PageArtist;
