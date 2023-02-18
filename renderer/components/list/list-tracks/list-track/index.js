import { timeFormat } from '~/renderer/utils/index';
import { slugifyFile } from '~/main/utils/files';
import Link from 'next/link';
import ListIntersection from '../../list-intersecton';

const ListTrack = ({ track, handlePlay }) => {
  const artist = slugifyFile(track?.artist);
  const album = slugifyFile(track?.album);

  return (
    <div className="list-track rounded transition">
      <div className="align-items-stretch flex select-none gap-5 rounded text-xs">
        <div
          className="group w-36 flex-auto cursor-pointer text-start font-headings"
          onClick={() => handlePlay(track)}
        >
          <div className="inline-block max-w-full truncate rounded py-2 px-3">
            {track?.title || 'Unkwon title'}
          </div>
        </div>
        <div className="hidden w-14 flex-auto sm:block">
          <Link
            className="inline-block max-w-full truncate rounded py-2 px-3"
            href={`/artist/${artist}`}
          >
            {track?.artist || 'Unkwon artist'}
          </Link>
        </div>
        <div className="hidden w-14 flex-auto sm:block">
          <Link
            className="inline-block max-w-full truncate rounded py-2 px-3"
            href={`/artist/${artist}/${album}`}
          >
            {track?.album || 'Unkwon album'}
          </Link>
        </div>
        <div className="hidden w-7 flex-auto lg:block">
          <div className="inline-block max-w-full truncate py-2 px-3">
            {track?.genre || 'Unkwon genre'}
          </div>
        </div>
        <div className="hidden w-14 flex-initial md:block">
          <div className="inline-block max-w-full truncate py-2 px-3">
            {track?.year || '0000'}
          </div>
        </div>
        <div className="w-14 flex-initial text-end">
          <div className="inline-block max-w-full truncate py-2 px-3">
            {timeFormat(track?.duration) || '00:00'}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ListTrack;
