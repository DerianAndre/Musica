import Link from 'next/link';
import { Artist } from '~/types';
import ListIntersection from '../../list-intersecton';
import ListCoverCollage from '../../list-cover-collage';
import { Suspense } from 'react';

// TODO: Improve performance

interface IProps {
  artist: Artist;
  single?: boolean;
}

const ListArtist = ({ artist, single }: IProps) => {
  return (
    <div className="list-artist flex h-full min-h-[150px] w-full">
      <Link
        className="list-artist-link flex h-full w-full flex-col items-center rounded p-3 transition hover:bg-base-content/[0.15] dark:hover:bg-base-content/[0.05] dark:hover:shadow-lg"
        href={`/artist/${artist?.slug}/`}
      >
        <div
          className={`block aspect-[1/1] w-full overflow-hidden bg-base-300 ${
            single ? 'rounded-full' : ''
          }`}
        >
          <ListIntersection>
            <ListCoverCollage albums={artist?.albums} single={single} />
          </ListIntersection>
        </div>
        <h2 className="mt-2 text-center font-headings font-semibold">
          {artist.title}
        </h2>
      </Link>
    </div>
  );
};

export default ListArtist;
