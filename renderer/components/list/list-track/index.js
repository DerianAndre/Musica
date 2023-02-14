import { MdPlayArrow } from "react-icons/md";

const ListTrack = ({ track, handlePlay }) => {
  return (
    <div
      className="list-tracks"
      key={track.path}
      onClick={() => handlePlay(track.path)}
    >
      <div className="list-tracks cursor-pointer group flex text-sm align-items-center align-bottom gap-3 select-none transition duration-150 ease-in hover:bg-base-300 rounded p-1">
        <div className="flex-initial">
          <div className="relative">
            <span className="opacity-50">{track.track}</span>
            {false && (
              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                <button
                  className="btn btn-circle btn-ghost btn-xs text-xl opacity-0 group-hover:opacity-100"
                  onClick={() => handlePlay(track.path)}
                >
                  <MdPlayArrow />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">{track.title}</div>
      </div>
    </div>
  );
};
export default ListTrack;
