import { getImage } from '~/renderer/utils';

interface IProps {
  cover?: string;
}

const PageCover = ({ cover }: IProps) => {
  return cover ? (
    <div
      className="swap fixed inset-0 -z-50 bg-cover bg-center opacity-[0.2] blur-lg dark:opacity-[0.05]"
      style={{ backgroundImage: `url(${getImage(cover)})` }}
    />
  ) : (
    <></>
  );
};

export default PageCover;
