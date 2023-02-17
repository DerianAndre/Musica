const ListTrack = ({ track, handlePlay }) => {
  return (
    <div className="list-track" onClick={() => handlePlay(track)}>
      <div className="list-tracks align-items-center flex cursor-pointer select-none gap-3 rounded p-1 align-bottom text-sm transition duration-150 ease-in hover:bg-base-300">
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
