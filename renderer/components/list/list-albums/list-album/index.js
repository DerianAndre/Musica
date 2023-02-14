import ListCover from "../../list-cover";

const ListAlbum = ({ artist, album = {} }) => {
  return (
    <div className="list-album">
      <div className="flex flex-col">
        <ListCover album={album} />
        <h2 className="font-headings text-sm font-bold mt-2 leading-[1.15]">
          {album?.title}
        </h2>
        <h3 className="font-medium text-xs opacity-50">{artist}</h3>
      </div>
    </div>
  );
};

export default ListAlbum;
