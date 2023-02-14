import ListCover from "../../list-cover";

const ListAlbum = ({ artist, album = {} }) => {
  return (
    <div className="list-album">
      <div className="flex flex-col">
        <ListCover album={album} />
        <h2 className="mt-2">{album?.title}</h2>
        <h3 className="text-sm opacity-50">{artist}</h3>
      </div>
    </div>
  );
};

export default ListAlbum;
