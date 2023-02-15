import ListTracks from "../../list-track";
import ListCover from "../../list-cover";

const ListAllItem = ({ library, artist, handlePlay }) => {
  return (
    <div>
      <h2 className="font-headings text-3xl font-semibold">{artist}</h2>
      <div className="divide-y divide-black/[0.1] dark:divide-white/[0.05]">
        {library[artist]?.albums?.map((album) => (
          <div className="flex gap-5 py-5" key={album.title}>
            <div className="album-cover flex-initial">
              <ListCover album={album} width="150px" />
            </div>
            <div className="info flex-auto">
              <h3 className="font-headings text-2xl font-semibold">
                {album.title}{" "}
                <small className="opacity-30">({album.year})</small>
              </h3>
              <h4 className="font-headings opacity-50 text-lg mb-4">
                {album.genre}
              </h4>
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
  );
};

export default ListAllItem;
