import Link from 'next/link';
import { Fragment } from 'react';
import { formatGenre, formatTotal, formatTotalTime } from '~/renderer/utils';
import {
  Album,
  Artist,
  Genre,
  TotalDuration,
  TotalTracks,
  Year,
} from '../icons';

type IProps = {
  icons?: Boolean;
  artist?: {
    slug?: string;
    title?: string;
  };
  album?: {
    slug?: string;
    title?: string;
  };
  year?: number | string | null;
  genre?: string | string[];
  totalAlbums?: number;
  totalTracks?: number;
  totalDuration?: number;
};

const HeaderInfo = (props: IProps) => {
  const {
    icons = true,
    artist = undefined,
    album = undefined,
    year = undefined,
    genre = undefined,
    totalAlbums = undefined,
    totalTracks = undefined,
    totalDuration = undefined,
  } = props;

  const Element: {
    [key: string]: () => JSX.Element;
  } = {
    artist: () => <Link href={`/artist/${artist?.slug}`}>{artist?.title}</Link>,
    album: () => (
      <Link href={`/artist/${artist?.slug}/${album?.slug}`}>
        {album?.title}
      </Link>
    ),
    year: () => <>{String(year)}</>,
    genre: () => <>{formatGenre(genre)}</>,
    totalAlbums: () => <>{formatTotal(totalAlbums, 'albums', 'album')}</>,
    totalTracks: () => <>{formatTotal(totalTracks, 'tracks', 'track')}</>,
    totalDuration: () => <>{formatTotalTime(totalDuration)}</>,
  };

  const Icon: {
    [key: string]: JSX.Element;
  } = {
    artist: <Artist />,
    album: <Album />,
    year: <Year className="text-sm" />,
    genre: <Genre />,
    totalAlbums: <Album />,
    totalTracks: <TotalTracks className="text-xl" />,
    totalDuration: <TotalDuration className="text-sm" />,
  };

  return (
    <div className="mb-3 flex max-w-full flex-wrap gap-2 opacity-50">
      {Object.keys(props).map((item, index) => {
        if (item === 'icons') return <></>;

        return (
          <Fragment key={index}>
            <>
              {index !== 0 && <span>•</span>}
              <div className="flex items-center gap-1">
                {icons && Icon[item] ? Icon[item] : <></>}
                {Element[item] ? <div>{Element[item]()}</div> : <></>}
              </div>
            </>
          </Fragment>
        );
      })}
    </div>
  );
};

export default HeaderInfo;
