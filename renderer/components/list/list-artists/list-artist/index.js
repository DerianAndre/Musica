import Link from "next/link";
import ListCover from "../../list-cover";

const ListArtist = ({ artist, data }) => {
  return (
    <div className="list-artist">
      <div className="flex flex-col items-center">
        <Link href={`/artist/${data?.slug}/`}>
          <ListCover
            album={data?.albums ? data?.albums[0] : null}
            rounded={true}
          />
          <h2 className="text-center font-headings font-semibold mt-2">
            {artist}
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default ListArtist;
