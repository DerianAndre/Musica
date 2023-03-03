import Link from 'next/link';
import { Artist } from '~/types';
import ListCover from '../../list-cover';

interface IProps {
  artist: Artist;
}

const ListArtist = ({ artist }: IProps) => {
  return (
    <div className="list-artist flex h-full w-full">
      <Link
        className="list-artist-link flex h-full w-full flex-col items-center rounded p-3 transition hover:bg-base-content/[0.15] dark:hover:bg-base-content/[0.05] dark:hover:shadow-lg"
        href={`/artist/${artist?.slug}/`}
      >
        <ListCover
          album={artist?.albums ? artist?.albums[0] : null}
          rounded={true}
        />
        <h2 className="mt-2 text-center font-headings font-semibold">
          {artist.title}
        </h2>
      </Link>
    </div>
  );
};

export default ListArtist;
