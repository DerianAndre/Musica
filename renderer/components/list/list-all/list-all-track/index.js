import { handlePlay } from '~/renderer/components/player/utils';

const ListTrack = ({ track }) => {
  return (
    <div className="list-track transition" onClick={() => handlePlay(track)}>
      <div className="list-tracks align-items-center flex cursor-pointer select-none gap-3 rounded p-2 align-bottom text-sm">
        <div className="flex-initial">
          <div className="relative">
            <span className="opacity-50">{track?.track}</span>
          </div>
        </div>
        <div className="flex-1">{track?.title}</div>
      </div>
    </div>
  );
};
export default ListTrack;
