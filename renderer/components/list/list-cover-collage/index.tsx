import { Album } from '~/types';
import ListCover from '../list-cover';

const getNoCols = (noAlbums: number, single: boolean): number => {
  if (single) return 1;

  /*
  // TODO Improve peformance first
  if (noAlbums >= 36) {
    return 6;
  }
  if (noAlbums >= 25) {
    return 5;
  }
  if (noAlbums >= 16) {
    return 4;
  }
  */

  if (noAlbums >= 9) {
    return 3;
  }
  if (noAlbums >= 4) {
    return 2;
  }
  return 1;
};

interface IProps {
  albums: Album[];
  single?: boolean;
}

const ListCoverCollage = ({ albums, single = true }: IProps) => {
  return (
    <div
      className={`grid aspect-[1/1] w-full gap-0 overflow-hidden grid-cols-${getNoCols(
        albums?.length,
        single,
      )}`}
    >
      {albums?.map((album, index) => {
        return (
          index < getNoCols(albums?.length, single) ** 2 && (
            <ListCover
              key={album.slug}
              album={album}
              rounded={single}
              bordered={single}
            />
          )
        );
      })}
    </div>
  );
};

export default ListCoverCollage;
