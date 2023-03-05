/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { slugify } from '~/main/utils/files';
import {
  formatBitrate,
  formatSamplerate,
  getAudioQuality,
} from '~/renderer/utils';

const PlayerInfo = ({ data }: any) => {
  const trackData = data?.data || {};
  const metaData = data?.metadata || {};
  const artist = slugify(trackData.artist);
  const album = slugify(trackData.album);
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
    <div className="track-info w-full">
      <div className="flex w-full items-center justify-start gap-3">
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
          <div className="track-metadata flex w-full flex-1 flex-col truncate">
            <Link
              href={`/artist/${artist}/${album}/${track}`}
              className="text-md w-full truncate font-headings font-bold"
            >
              {metaData?.common?.title}
            </Link>
            <h3 className="w-full truncate text-sm font-medium opacity-75">
              <Link href={`/artist/${artist}`}>{metaData?.common?.artist}</Link>
              <span className="opacity-50"> • </span>
              <Link href={`/artist/${artist}/${album}`}>
                {metaData?.common?.album}
              </Link>
            </h3>
            <div className="w-full truncate text-xs font-normal opacity-50">
              <span>
                {getAudioQuality(
                  metaData?.format?.bitsPerSample,
                  metaData?.format?.sampleRate,
                  metaData?.format?.container,
                )}
              </span>
              <span className="opacity-50"> • </span>
              <span>{metaData?.format?.container.split('/')[0]}</span>
              <span className="opacity-50"> • </span>
              <span>{formatSamplerate(metaData?.format?.sampleRate)}</span>
              <span className="opacity-50"> • </span>
              <span>{metaData?.format?.bitsPerSample || 0} bits</span>
              <span className="opacity-50"> • </span>
              <span>{formatBitrate(metaData?.format?.bitrate)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerInfo;
