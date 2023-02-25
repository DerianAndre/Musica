import { handlePlay } from '~/renderer/components/player/utils';
import { formatDuration } from '~/renderer/utils';
import { Track } from '~/types';

const ListTrack = ({ track }: { track: Track }) => {
  return (
    <div className="list-track transition" onClick={() => handlePlay(track)}>
      <div className="list-tracks align-items-center flex cursor-pointer select-none gap-3 rounded p-2 align-bottom text-sm">
        <div className="w-6 opacity-50">{track?.track}</div>
        <div className="min-w-[150px] flex-1 truncate">{track?.title}</div>
        <div className="w-14 flex-initial truncate text-center opacity-50">
          {track?.year}
        </div>
        <div className="w-28 flex-initial truncate text-center opacity-75">
          {track?.genre}
        </div>
        <div className="w-14 flex-initial truncate opacity-50">
          {formatDuration(track?.duration)}
        </div>
      </div>
    </div>
  );
};

export default ListTrack;