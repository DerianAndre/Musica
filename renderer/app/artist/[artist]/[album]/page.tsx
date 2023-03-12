'use client';

import React, { useContext } from 'react';
import { Library, Playlist } from '~/types';
import ListIntersection from '~/renderer/components/list/list-intersecton';
import ListAllItem from '~/renderer/components/list/list-all/list-all-item';
import { PlayerContext } from '~/renderer/context';
import { MdPlayArrow } from 'react-icons/md';
import { shufflePlaylist } from '~/renderer/utils/random';
import { Shuffle } from '~/renderer/components/icons';
import PageCover from '~/renderer/components/page-cover';
import GoBack from '~/renderer/components/go-back';
import { getAlbumTotalDuration, getAlbumTotalTracks } from '~/renderer/utils';
import HeaderInfo from '~/renderer/components/header-info';

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
      <PageCover album={dataAlbum} />

      <GoBack />

      <header>
        <h2 className="font-headings text-3xl font-semibold">
          {dataAlbum?.title}
        </h2>
        <HeaderInfo
          artist={{ slug: artist, title: dataArtist?.title }}
          year={dataAlbum?.year}
          genre={dataAlbum?.genre}
          totalTracks={totalTracks}
          totalDuration={totalDuration}
        />
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
          artist={dataArtist}
          album={dataAlbum}
          show={{ artist: false, info: false }}
        />
      </ListIntersection>
    </>
  );
};

export default PageArtist;
