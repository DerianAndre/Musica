import Link from 'next/link';
import ListCover from '../../list-cover';

const ListArtist = ({ artist, data }) => {
  return (
    <div className="list-artist flex h-full">
      <Link
        className="flex h-full flex-col items-center rounded p-3 transition hover:bg-base-content/[0.15] dark:hover:bg-base-content/[0.05] dark:hover:shadow-lg"
        href={`/artist/${data?.slug}/`}
      >
        <ListCover
          album={data?.albums ? data?.albums[0] : null}
          rounded={true}
        />
        <h2 className="mt-2 text-center font-headings font-semibold">
          {artist}
        </h2>
      </Link>
    </div>
  );
};

export default ListArtist;
