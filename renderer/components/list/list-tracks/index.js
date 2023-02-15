import ListIntersection from "../list-intersecton";
import ListTrack from "./list-track";

const ListTracks = ({ library, handlePlay }) => {
  const tracks = Object.values(library)
    .flatMap((item) => {
      return item.albums?.map((album) =>
        album?.tracks?.map((track) => ({ ...track, album: album.title }))
      );
    })
    .reduce((tracks, albumTracks) => tracks.concat(albumTracks), [])
    .sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });

  return (
    <div className="list-tracks">
      <div className="divide-y divide-base-300">
        {tracks?.map((track, index) => (
          <ListIntersection key={index + track?.path}>
            <ListTrack track={track} handlePlay={handlePlay} />
          </ListIntersection>
        ))}
      </div>
    </div>
  );
};

export default ListTracks;
