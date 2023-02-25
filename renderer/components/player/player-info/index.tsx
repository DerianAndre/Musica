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
  const formatBitrate = (
    sizeInBytes: number,
    outputUnit: string = 'kb/s',
  ): string => {
    if (sizeInBytes <= 0) {
      throw new Error('File size must be positive');
    }
    const byteUnits = ['b/s', 'kb/s', 'Mb/s', 'Gb/s', 'Tb/s'];

    const byteUnitIndex = byteUnits.indexOf(outputUnit);

    if (byteUnitIndex === -1) {
      throw new Error(`Invalid output unit: ${outputUnit}`);
    }

    let i = 0;
    let fileSize = sizeInBytes;
    while (fileSize >= 1024 && i < byteUnits.length - 1) {
      fileSize /= 1024;
      i++;
    }

    const value = fileSize.toFixed();
    const unit = byteUnits[i];

    return `${value} ${unit}`;
  };

  const formatSamplerate = (
    frequencyInHertz: number,
    outputUnit: string = 'Hz',
  ): string => {
    if (frequencyInHertz < 0) {
      throw new Error('Frequency must be non-negative');
    }
    const hertzUnits = ['Hz', 'kHz', 'MHz', 'GHz'];

    const hertzUnitIndex = hertzUnits.indexOf(outputUnit);
    if (hertzUnitIndex === -1) {
      throw new Error(`Invalid output unit: ${outputUnit}`);
    }

    let i = 0;
    let frequency = frequencyInHertz;
    while (frequency >= 1000 && i < hertzUnits.length - 1) {
      frequency /= 1000;
      i++;
    }

    const value = frequency.toFixed(1);
    const unit = hertzUnits[i];

    return `${value} ${unit}`;
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
              <span> • </span>
              <Link href={`/artist/${artist}/${album}`}>
                {metaData?.common?.album}
              </Link>
            </h3>
            <div className="w-full truncate text-xs font-normal opacity-50">
              {metaData?.format?.container} •{' '}
              {formatBitrate(metaData?.format?.bitrate)} •{' '}
              {formatSamplerate(metaData?.format?.sampleRate)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerInfo;
