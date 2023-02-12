import { MdPlayArrow } from "react-icons/md";

const ListTracks = ({ track, handlePlay }) => {
  return (
    <div
      className="track group flex text-sm align-items-center align-bottom gap-3 select-none transition duration-150 ease-in hover:bg-accent/25 rounded p-1"
      key={track.path}
    >
      <div className="flex-initial">
        <button
          className="btn btn-circle btn-ghost btn-xs text-xl opacity-0 group-hover:opacity-100"
          onClick={() => handlePlay(track.path)}
        >
          <MdPlayArrow />
        </button>
      </div>
      <div className="flex-initial opacity-50">{track.track}</div>
      <div className="flex-1">{track.title}</div>
    </div>
  );
};
export default ListTracks;
