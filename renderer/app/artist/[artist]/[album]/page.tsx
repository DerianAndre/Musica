'use client';

import React, { useEffect, useState } from 'react';
import { Artist, Album, Track } from '~/types';
import loadChunk from '~/library/chunks';
import Link from 'next/link';

const PageAlbum = ({
  params,
}: {
  params: { artist: string; album: string };
}) => {
  const { artist, album } = params;

  const [dataArtist, setDataArtist] = useState<Artist>();

  const [dataAlbum, setDataAlbum] = useState<Album>();

  const getArtistData = async () => {
    const artistChunk = await loadChunk({
      chunk: undefined,
      slug: artist,
      setter: undefined,
    });

    setDataArtist(artistChunk);

    const albumChunk = artistChunk?.albums?.find(
      (item: Album) => item?.slug === album,
    );

    setDataAlbum(albumChunk);
  };

  useEffect(() => {
    if (!artist || !album) return;
    getArtistData();
  }, [artist, album]);

  return (
    <div>
      <Link href={`/artist/${dataArtist?.slug}`}>{dataArtist?.title}</Link>
      <h3>{dataAlbum?.title}</h3>
    </div>
  );
};

export default PageAlbum;
