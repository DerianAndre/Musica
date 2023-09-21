'use client';

import React, { useContext } from 'react';
import GoBack from '~/renderer/components/go-back';
import HeaderInfo from '~/renderer/components/header-info';
import PageCover from '~/renderer/components/page-cover';
import { PlayerContext } from '~/renderer/context';
import {
  formatBitrate,
  formatSamplerate,
  formatTotalTime,
  formatGenre,
  getAudioQuality,
} from '~/renderer/utils';

interface IProps {
  params: {
    artist: string;
    album: string;
    track: string;
  };
}

const PageTrack = ({ params }: IProps) => {
  const { artist, album, track } = params;
  const { library, list } = useContext(PlayerContext);
  const listArtist = list.find((item) => item.slug === artist);
  const dataArtist = library[listArtist?.artist || ''];
  const dataAlbum = dataArtist?.albums?.find((item) => item.slug === album);
  const dataTrack = dataAlbum?.tracks?.find((item) => item.slug === track);

  return (
    <>
      <PageCover album={dataAlbum} />
      <GoBack />
      <div className="flex flex-col">
        <h2 className="font-headings text-3xl font-semibold">
          {dataTrack?.title}
        </h2>
        <HeaderInfo
          artist={{ slug: artist, title: dataArtist?.title }}
          album={{ slug: album, title: dataAlbum?.title }}
          genre={dataAlbum?.genre}
        />

        <div className="overflow-x-auto">
          <table className="table-zebra table-compact table w-full opacity-75">
            <tbody>
              <tr>
                <td className="font-bold">Title</td>
                <td>{dataTrack?.title}</td>
              </tr>
              <tr>
                <td className="font-bold">Album</td>
                <td>{dataTrack?.album}</td>
              </tr>
              <tr>
                <td className="font-bold">Track</td>
                <td>{dataTrack?.track}</td>
              </tr>
              <tr>
                <td className="font-bold">Year</td>
                <td>{String(dataTrack?.year)}</td>
              </tr>
              <tr>
                <td className="font-bold">Genre</td>
                <td>{formatGenre(dataTrack?.genre)}</td>
              </tr>
              <tr>
                <td className="font-bold">Duration</td>
                <td>{formatTotalTime(dataTrack?.duration)}</td>
              </tr>
              <tr>
                <td className="font-bold">Quality</td>
                <td>
                  {getAudioQuality(
                    dataTrack?.bitsPerSample,
                    dataTrack?.sampleRate,
                    dataTrack?.container,
                  )}
                </td>
              </tr>
              <tr>
                <td className="font-bold">Bit Rate</td>
                <td>{formatBitrate(dataTrack?.bitRate)}</td>
              </tr>
              <tr>
                <td className="font-bold">Sample Rate</td>
                <td>{formatSamplerate(dataTrack?.sampleRate)}</td>
              </tr>
              <tr>
                <td className="font-bold">Bit Depth</td>
                <td>{dataTrack?.bitsPerSample || 0} bits</td>
              </tr>
              <tr>
                <td className="font-bold">Codec</td>
                <td>{dataTrack?.codec}</td>
              </tr>
              <tr>
                <td className="font-bold">Container</td>
                <td>{dataTrack?.container}</td>
              </tr>
              <tr>
                <td className="font-bold">Path</td>
                <td>{dataTrack?.path}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PageTrack;
