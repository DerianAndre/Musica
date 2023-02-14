import ListArtist from "./list-artist";

const ListArtists = ({ library, handlePlay }) => {
  if (!library) return;

  const artists = Object.keys(library);

  return (
    <div className="list-artists">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 3xl:grid-cols-10 4xl:grid-cols-12 gap-10">
        {artists?.map((artist) => (
          <ListArtist key={artist} artist={artist} data={library[artist]} />
        ))}
      </div>
    </div>
  );
};

export default ListArtists;
