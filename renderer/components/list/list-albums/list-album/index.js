import ListCover from '../../list-cover';
import Link from 'next/link';
import { slugify } from '~/main/utils/files';

const ListAlbum = ({ artist, album = {}, ...props }) => {
  return (
    <div
      className="list-album flex h-full w-full"
      id={album?.id}
      data-id={album?.id}
    >
      <Link
        className="list-ablbum-link flex h-full w-full flex-col rounded p-3 transition hover:bg-base-content/[0.15] dark:hover:bg-base-content/[0.05] dark:hover:shadow-lg"
        href={`/artist/${slugify(artist)}/${album?.slug}`}
      >
        <ListCover album={album} />
        <h2 className="mt-2 font-headings text-sm font-bold leading-[1.15]">
          {album?.title}
        </h2>
        <h3 className="text-xs font-medium opacity-50">{artist}</h3>
      </Link>
    </div>
  );
};

export default ListAlbum;
