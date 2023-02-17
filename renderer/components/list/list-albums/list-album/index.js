import ListCover from '../../list-cover';
import Link from 'next/link';
import { slugifyFile } from '~/main/utils/files';

const ListAlbum = ({ artist, album = {}, ...props }) => {
  return (
    <div className="list-album" id={album?.id} data-id={album?.id}>
      <Link href={`/artist/${slugifyFile(artist)}/${album?.slug}`}>
        <div className="flex flex-col">
          <ListCover album={album} />
          <h2 className="mt-2 font-headings text-sm font-bold leading-[1.15]">
            {album?.title}
          </h2>
          <h3 className="text-xs font-medium opacity-50">{artist}</h3>
        </div>
      </Link>
    </div>
  );
};

export default ListAlbum;
