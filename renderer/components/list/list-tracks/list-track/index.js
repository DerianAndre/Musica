import { timeFormat } from "../../../../utils";
import { MdPlayArrow } from "react-icons/md";

const ListTrack = ({ track, handlePlay }) => {
  return (
    <div
      className="list-track cursor-pointer"
      onClick={() => handlePlay(track?.path)}
    >
      <div className="my-1 p-3 gap-5 group flex text-xs align-items-center align-bottom select-none transition duration-150 ease-in hover:bg-base-300 rounded">
        <div className="flex-auto truncate w-36 font-headings">
          {track?.title || "Unkwon title"}
        </div>
        <div className="flex-auto truncate w-14 hidden sm:block">
          {track?.artist || "Unkwon artist"}
        </div>
        <div className="flex-auto truncate w-14 hidden sm:block">
          {track?.album || "Unkwon album"}
        </div>
        <div className="flex-auto truncate w-7 hidden lg:block">
          {track?.genre || "Unkwon genre"}
        </div>
        <div className="flex-initial truncate w-14 hidden md:block">
          {track?.year || "0000"}
        </div>
        <div className="flex-initial truncate w-14 text-end">
          {timeFormat(track?.duration) || "00:00"}
        </div>
      </div>
    </div>
  );
};
export default ListTrack;
