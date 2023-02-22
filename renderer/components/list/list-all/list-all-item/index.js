import React, { Fragment } from 'react';
import ListAllTrack from '../list-all-track';
import ListCover from '../../list-cover';
import ListIntersection from '../../list-intersecton';
import Link from 'next/link';
import { slugifyFile } from '~/main/utils/files';

const ListAllItem = ({ library, artist, show = { artist: true } }) => {
  const albums = library[artist]?.albums?.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });

  return (
    <div>
      {show.artist && (
        <h2 className="font-headings text-3xl font-semibold">{artist}</h2>
      )}
      <div className="divide-y divide-black/[0.1] dark:divide-white/[0.05]">
        {albums?.map((album) => (
          <Fragment key={album?.title}>
            <ListIntersection>
              <div className="flex flex-wrap gap-5 py-5">
                <div className="w-full flex-none md:w-[200px]">
                  <Link href={`/artist/${slugifyFile(artist)}/${album?.slug}`}>
                    <ListCover album={album} width="200px" />
                  </Link>
                </div>
                <div className="list-info flex-auto">
                  <h3 className="font-headings text-2xl font-semibold">
                    {album?.title}
                  </h3>
                  <h4 className="mb-4 font-headings opacity-50">
                    {album?.year} • {album?.genre}
                  </h4>
                  <div className="flex flex-col gap-1 [&>.item:nth-child(odd)]:bg-base-200 hover:[&>.item]:bg-base-300">
                    {album?.tracks?.map((track) => (
                      <ListIntersection key={track?.path}>
                        <ListAllTrack track={track} />
                      </ListIntersection>
                    ))}
                  </div>
                </div>
              </div>
            </ListIntersection>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ListAllItem;
