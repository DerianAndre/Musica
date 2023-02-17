'use client';

import React, { useEffect, useState } from 'react';
import { Artist, Album, Track } from '~/types';
import loadChunk from '~/library/chunks';

const PageArtist = ({ params }: { params: { artist: string } }) => {
  const { artist } = params;

  const [data, setData] = useState<Artist>({
    title: '',
    slug: '',
    albums: [],
  });

  const getArtistData = async () => {
    const data = await loadChunk({
      chunk: undefined,
      slug: artist,
      setter: undefined,
    });
    setData(data);
  };

  useEffect(() => {
    if (!artist) return;
    getArtistData();
  }, [artist]);

  return (
    <div>
      <h2>{data.title}</h2>
    </div>
  );
};

export default PageArtist;
