import ListTracks from "./list-tracks";

const List = ({ library, handlePlay, show = true }) => {
  return (
    Object.keys(library).length > 0 &&
    show &&
    Object.keys(library)?.map((artist) => (
      <div key={artist}>
        <h2 className="text-2xl font-semibold mb-5">{artist}</h2>
        <div className="divide-y divide-slate-700">
          {library[artist]?.albums.map((album) => (
            <div className="flex gap-3 py-3" key={album.title}>
              <div className="album-cover flex-initial">
                <img
                  className="block"
                  width="100px"
                  height="100px"
                  src={
                    album?.cover
                      ? `D:\\Websites\\GitHub\\Derian Andre\\Musica\\cache\\${album.cover}`
                      : ""
                  }
                  loading="lazy"
                />
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
