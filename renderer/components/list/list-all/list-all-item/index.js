import ListAllTrack from "../list-all-track";
import ListCover from "../../list-cover";
import ListIntersection from "../../list-intersecton";

const ListAllItem = ({ library, artist, handlePlay }) => {
  const albums = library[artist]?.albums?.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });

  return (
    <div>
      <h2 className="font-headings text-3xl font-semibold">{artist}</h2>
      <div className="divide-y divide-black/[0.1] dark:divide-white/[0.05]">
        {albums.map((album) => (
          <ListIntersection key={album?.title}>
            <div className="flex flex-wrap gap-5 py-5">
              <div className="flex-none w-full md:w-[150px]">
                <ListCover album={album} width="150px" />
              </div>
              <div className="list-info flex-auto">
                <h3 className="font-headings text-2xl font-semibold">
                  {album?.title}
                </h3>
                <h4 className="font-headings opacity-50 mb-4">
                  {album?.year} • {album?.genre}
                </h4>
                <div className="flex flex-col">
                  {album?.tracks?.map((track) => (
                    <ListIntersection key={track?.path}>
                      <ListAllTrack track={track} handlePlay={handlePlay} />
                    </ListIntersection>
                  ))}
                </div>
              </div>
            </div>
          </ListIntersection>
        ))}
      </div>
      <div className="divider" />
    </div>
  );
};

export default ListAllItem;