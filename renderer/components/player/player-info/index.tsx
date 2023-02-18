/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { slugifyFile } from '~/main/utils/files';

const PlayerInfo = ({ data }: any) => {
  const trackData = data?.data || {};
  const metaData = data?.metadata || {};
  const artist = slugifyFile(trackData.artist);
  const album = slugifyFile(trackData.album);
  const track = trackData.slug;

  const playerArtImage = (object: any) => {
    if (object?.data) {
      return URL.createObjectURL(
        new Blob([object?.data], { type: object?.data?.format }),
      );
    } else {
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    }
  };

  return (
    <div className="track-info">
      <div className="flex items-center justify-start gap-3">
        <Link
          className="hidden sm:flex"
          href={artist ? `/artist/${artist}/${album}` : '#'}
        >
          <figure className="track-art swap select-none">
            <img
              className="d-block max-w-none rounded-sm"
              src={playerArtImage(metaData?.common?.picture?.[0])}
              width="75px"
              height="75px"
              alt={trackData.album}
            />
          </figure>
        </Link>
        {metaData?.common?.title && (
          <div className="track-metadata max-w-[250px]">
            <Link
              href={`/artist/${artist}/${album}/${track}`}
              className="text-md block max-h-[50px] overflow-hidden font-headings font-bold"
            >
              {metaData?.common?.title}
            </Link>
            <h3 className="w-fulltruncate text-xs font-medium opacity-60">
              <Link href={`/artist/${artist}`}>{metaData?.common?.artist}</Link>
              <span> • </span>
              <Link href={`/artist/${artist}/${album}`}>
                {metaData?.common?.album}
              </Link>
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerInfo;
