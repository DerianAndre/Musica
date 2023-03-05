import { handlePlay } from '~/renderer/components/player/utils';
import { formatDuration, formatGenre, getAudioQuality } from '~/renderer/utils';
import { Track } from '~/types';

const ListTrack = ({ track }: { track: Track }) => {
  return (
    <div className="list-track transition" onClick={() => handlePlay(track)}>
      <div className="list-tracks align-items-center flex cursor-pointer select-none gap-3 rounded p-2 align-bottom text-sm">
        <div className="w-6 opacity-50">{track?.track}</div>
        <div className="min-w-[150px] flex-1 truncate">{track?.title}</div>
        <div className="w-14 flex-initial truncate text-center opacity-75">
          {getAudioQuality(
            track?.bitsPerSample,
            track?.sampleRate,
            track?.container,
          )}
        </div>
        <div className="w-14 flex-initial truncate text-center opacity-50">
          {track?.extension.toUpperCase()}
        </div>
        <div className="w-28 flex-initial truncate text-center opacity-75">
          {formatGenre(track?.genre)}
        </div>
        <div className="w-14 flex-initial truncate text-center opacity-50">
          {String(track?.year)}
        </div>
        <div className="w-14 flex-initial truncate opacity-75">
          {formatDuration(track?.duration)}
        </div>
      </div>
    </div>
  );
};

export default ListTrack;
