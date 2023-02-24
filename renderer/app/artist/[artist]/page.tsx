'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Artist, Playlist } from '~/types';
import loadChunk from '~/library/chunks';
import ListIntersection from '~/renderer/components/list/list-intersecton';
import ListAllItem from '~/renderer/components/list/list-all/list-all-item';
import { PlayerContext } from '~/renderer/context';
import { MdPlayArrow } from 'react-icons/md';
import { albumsToTracks, sortAlbums } from '~/renderer/utils';
import { Shuffle } from '~/renderer/components/icons';
import { shufflePlaylist } from '~/renderer/utils/random';
import PageCover from '~/renderer/components/page-cover';

const PageArtist = ({ params }: { params: { artist: string } }) => {
  const { artist } = params;
  const { handlePlayPlaylist } = useContext(PlayerContext);

  const [data, setData] = useState<Artist>({
    title: 'Artist',
    slug: 'artist',
    albums: [],
  });
  const [artistPlaylist, setArtistPlaylist] = useState<Playlist>({
    title: 'Playlist',
    slug: 'playlist',
    tracks: [],
  });

  const totalAlbums = data.albums.length;
  const totalSongs = data.albums.reduce(
    (current, item) => item?.tracks?.length + current,
    0,
  );

  useEffect(() => {
    if (!artist) return;

    const getArtistData = async () => {
      const data = await loadChunk({
        chunk: undefined,
        slug: artist,
        setter: undefined,
      });

      setData(data);

      const playlist: Playlist = {
        slug: artist,
        title: data?.title,
        tracks: albumsToTracks(sortAlbums(data?.albums)),
      };

      setArtistPlaylist(playlist);
    };

    getArtistData();
  }, [artist]);

  return (
    <>
      <PageCover cover={data?.albums[0]?.cover} />
      <h2 className="font-headings text-3xl font-semibold">{data.title}</h2>
      <div className="mb-3 flex gap-2 opacity-50">
        <div>
          {totalAlbums} {totalAlbums > 1 ? 'albums' : 'album'}
        </div>
        •
        <div>
          {totalSongs} {totalSongs > 1 ? 'songs' : 'song'}
        </div>
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
      <ListIntersection>
        <ListAllItem
          library={{ [data.title]: data }}
          artist={data.title}
          show={{ artist: false }}
        />
      </ListIntersection>
    </>
  );
};

export default PageArtist;
