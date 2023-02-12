import ListTracks from "./list-tracks";

const List = ({ library, handlePlay, show = true }) => {
  return (
    Object.keys(library).length > 0 &&
    show &&
    Object.keys(library)?.map((artist) => (
      <div key={artist}>
        <h2 className="text-2xl font-semibold mb-5">{artist}</h2>
        {library[artist]?.albums.map((album, index) => (
          <div key={album.title}>
            <h3 className="text-lg mb-3">
              {album.title} <small className="opacity-30">({album.year})</small>
            </h3>
            <div className="flex flex-col mb-4">
              {album.tracks?.map((track) => (
                <ListTracks
                  key={track.path}
                  track={track}
                  handlePlay={handlePlay}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="divider" />
      </div>
    ))
  );
};

export default List;
