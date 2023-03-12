import { getAlbumImage } from '~/renderer/utils';
import { Album } from '~/types';

interface IProps {
  album?: Album | null;
}

const PageCover = ({ album }: IProps) => {
  return album ? (
    <div
      className="swap fixed inset-0 -z-50 bg-cover bg-center opacity-[0.2] blur-lg dark:opacity-[0.05]"
      style={{ backgroundImage: `url(${getAlbumImage(album)})` }}
    />
  ) : (
    <></>
  );
};

export default PageCover;
