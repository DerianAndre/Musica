'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Album, Artist, Playlist } from '~/types';
import loadChunk from '~/library/chunks';
import ListIntersection from '~/renderer/components/list/list-intersecton';
import ListAllItem from '~/renderer/components/list/list-all/list-all-item';
import { PlayerContext } from '~/renderer/context';
import { MdPlayArrow } from 'react-icons/md';
import { shufflePlaylist } from '~/renderer/utils/random';
import { Shuffle } from '~/renderer/components/icons';
import PageCover from '~/renderer/components/page-cover';

const PageArtist = ({
  params,
}: {
  params: { artist: string; album: string };
}) => {
  const { artist, album } = params;
  const { handlePlayPlaylist } = useContext(PlayerContext);

  const [data, setData] = useState<Artist>({
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

  useEffect(() => {
    if (!artist || !album) return;

    const getArtistData = async () => {
      const data = await loadChunk({
        chunk: undefined,
        slug: artist,
        setter: undefined,
      });

      setData(data);

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
      <ListIntersection>
        <ListAllItem
          library={{
            [data?.title]: {
              albums: [dataAlbum],
            },
          }}
          artist={data?.title}
          show={{ artist: false }}
        />
      </ListIntersection>
    </>
  );
};

export default PageArtist;
