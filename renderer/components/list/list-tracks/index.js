import { MdPlayArrow } from "react-icons/md";

const ListTracks = ({ track, handlePlay }) => {
  return (
    <div
      className="track group flex text-sm align-items-center align-bottom gap-3 select-none transition duration-150 ease-in hover:bg-accent/25 rounded p-1"
      key={track.path}
    >
      <div className="flex-initial">
        <div className="relative">
          <span className="opacity-50 group-hover:opacity-0">
            {track.track}
          </span>
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
            <button
              className="btn btn-circle btn-ghost btn-xs text-xl opacity-0 group-hover:opacity-100"
              onClick={() => handlePlay(track.path)}
            >
              <MdPlayArrow />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1" onClick={() => handlePlay(track.path)}>
        {track.title}
      </div>
    </div>
  );
};
export default ListTracks;
