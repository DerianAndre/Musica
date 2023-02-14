import ListTracks from "../list-track";
import ListCover from "../list-cover";

const List = ({ library, handlePlay }) => {
  if (!library) return;

  const objectKeys = Object.keys(library);

  return (
    objectKeys?.length > 0 &&
    objectKeys?.map((artist) => (
      <div key={artist}>
        <h2 className="text-2xl font-semibold">{artist}</h2>
        <div className="divide-y divide-base-300">
          {library[artist]?.albums?.map((album) => (
            <div className="flex gap-5 py-5" key={album.title}>
              <div className="album-cover flex-initial">
                <ListCover album={album} width="100px" />
              </div>
              <div className="info flex-auto">
                <h3 className="text-lg mb-3">
                  {album.title}{" "}
                  <small className="opacity-30">({album.year})</small>
                </h3>
                <div className="flex flex-col">
                  {album.tracks?.map((track) => (
                    <ListTracks
                      key={track.path}
                      track={track}
                      handlePlay={handlePlay}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="divider" />
      </div>
    ))
  );
};

export default List;
