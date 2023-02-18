'use client';

import React, { useEffect, useState } from 'react';
import { Artist, Album, Track } from '~/types';
import loadChunk from '~/library/chunks';
import ListIntersection from '~/renderer/components/list/list-intersecton';
import ListAll from '~/renderer/components/list/list-all';
import ListAllItem from '~/renderer/components/list/list-all/list-all-item';

const PageArtist = ({ params }: { params: { artist: string } }) => {
  const { artist } = params;

  const [data, setData] = useState<Artist>({
    title: '',
    slug: '',
    albums: [],
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
    };

    getArtistData();
  }, [artist]);

  return (
    <div>
      <h2 className="font-headings text-3xl font-semibold">{data.title}</h2>
      <div className="flex gap-3 opacity-50">
        <div>
          {totalAlbums} {totalAlbums > 1 ? 'albums' : 'album'}
        </div>
        <div>
          {totalSongs} {totalSongs > 1 ? 'songs' : 'song'}
        </div>
      </div>
      <ListIntersection>
        <ListAllItem
          library={{ [data.title]: data }}
          artist={data.title}
          show={{ artist: false }}
        />
      </ListIntersection>
    </div>
  );
};

export default PageArtist;
