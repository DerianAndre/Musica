import ListArtist from "./list-artist";

const ListArtists = ({ library, handlePlay }) => {
  if (!library) return;

  const artists = Object.keys(library);

  return (
    <div className="list-artists">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 4xl:grid-cols-10 gap-10">
        {artists?.map((artist) => (
          <ListArtist key={artist} artist={artist} data={library[artist]} />
        ))}
      </div>
    </div>
  );
};

export default ListArtists;
