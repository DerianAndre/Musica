'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Artist } from '~/types';
import loadChunk from '~/library/chunks';
import ListIntersection from '~/renderer/components/list/list-intersecton';
import ListAllItem from '~/renderer/components/list/list-all/list-all-item';
import { PlayerContext } from '~/renderer/context';
import { MdPlayArrow } from 'react-icons/md';

const PageArtist = ({
  params,
}: {
  params: { artist: string; album: string };
}) => {
  const { artist, album } = params;
  const { handlePlayPlaylist } = useContext(PlayerContext);

  const [data, setData] = useState<Artist>({
    title: '',
    slug: '',
    albums: [],
  });

  const dataAlbum = data?.albums?.find((item) => item.slug === album);

  useEffect(() => {
    if (!artist) return;

    const getArtistData = async () => {
      const data = await loadChunk({
        chunk: undefined,
        slug: artist,
        setter: undefined,
      });
      setData(data);
    };

    getArtistData();
  }, [artist]);

  return (
    <div>
      <button
        className="btn-sm btn gap-2"
        type="button"
        onClick={() => handlePlayPlaylist(dataAlbum)}
      >
        <MdPlayArrow /> Play album
      </button>
      <ListIntersection>
        <ListAllItem
          library={{
            [data.title]: {
              albums: [dataAlbum],
            },
          }}
          artist={data.title}
          show={{ artist: false }}
        />
      </ListIntersection>
    </div>
  );
};

export default PageArtist;
