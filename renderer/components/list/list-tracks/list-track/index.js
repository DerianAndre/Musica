import { timeFormat } from '../../../../utils';
import { MdPlayArrow } from 'react-icons/md';
import { slugifyFile } from '~/main/utils/files';
import Link from 'next/link';

const ListTrack = ({ track, handlePlay }) => {
  const artist = slugifyFile(track?.artist);
  const album = slugifyFile(track?.album);

  return (
    <div className="list-track bg-transparent even:bg-base-100">
      <div className="align-items-center my-1 flex select-none gap-5 rounded text-xs transition duration-150 ease-in hover:bg-base-100">
        <div
          className="group w-36 flex-auto cursor-pointer text-start font-headings"
          onClick={() => handlePlay(track)}
        >
          <div className="inline-block max-w-full truncate rounded py-2 px-3 group-hover:bg-base-300">
            {track?.title || 'Unkwon title'}
          </div>
        </div>
        <div className="hidden w-14 flex-auto sm:block">
          <Link
            className="inline-block max-w-full truncate rounded py-2 px-3 hover:bg-base-300"
            href={`/artist/${artist}`}
          >
            {track?.artist || 'Unkwon artist'}
          </Link>
        </div>
        <div className="hidden w-14 flex-auto sm:block">
          <Link
            className="inline-block max-w-full truncate rounded py-2 px-3 hover:bg-base-300"
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
