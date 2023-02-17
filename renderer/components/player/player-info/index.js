import Link from 'next/link';
import { slugifyFile } from '../../../../main/utils/files';
import PLAYER_STATES from '../constants';

const PlayerInfo = ({ state, data }) => {
  const trackData = data?.data || {};
  const metaData = data?.metadata || {};
  const artist = slugifyFile(trackData.artist);
  const album = slugifyFile(trackData.album);
  const track = trackData.slug;

  const playerArtImage = (object) => {
    if (object?.data) {
      return URL.createObjectURL(
        new Blob([object?.data], { type: object?.data?.format }),
      );
    } else {
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    }
  };

  return (
    <div className="track-info flex-1">
      <div className=" flex items-center justify-start gap-3">
        <Link href={`/album/${slugifyFile(trackData.album)}`}>
          <figure className="art swap select-none">
            <img
              className="d-block max-w-none rounded-sm"
              src={playerArtImage(metaData?.common?.picture?.[0])}
              width="75px"
              height="75px"
            />
          </figure>
        </Link>
        {metaData?.common?.title && (
          <div className="info">
            <Link
              href={`/artist/${artist}/${album}/${track}`}
              className="text-md font-headings font-bold"
            >
              {metaData?.common?.title}
            </Link>
            <h3 className="w-full text-ellipsis text-clip text-xs font-medium opacity-60">
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
