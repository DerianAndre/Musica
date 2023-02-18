'use client';

import React, { useEffect, useState } from 'react';
import { Artist, Album, Track } from '~/types';
import loadChunk from '~/library/chunks';
import ListIntersection from '~/renderer/components/list/list-intersecton';
import ListAll from '~/renderer/components/list/list-all';
import ListAllItem from '~/renderer/components/list/list-all/list-all-item';

const PageArtist = ({
  params,
}: {
  params: { artist: string; album: string };
}) => {
  const { artist, album } = params;

  const [data, setData] = useState<Artist>({
    title: '',
    slug: '',
    albums: [],
  });

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
      <ListIntersection>
        <ListAllItem
          library={{
            [data.title]: {
              albums: [data?.albums?.find((item) => item.slug === album)],
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
