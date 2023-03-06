'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { PlayerContext } from '~/renderer/context';
import { formatTotalTime } from '~/renderer/utils';
import GoBack from '~/renderer/components/go-back';
import ToggleTheme from '~/renderer/components/theme-toggle';
import { Play } from '~/renderer/components/icons';
import packageJson from '~/package.json';

// TODO: Improve UX/UI

const PageSettings = () => {
  const { library } = useContext(PlayerContext);

  const [libraryPath, setLibraryPath] = useLocalStorage(
    'musica-library-path',
    '<No folder selected>',
  );
  const [blurEnabled, setBlurEnabled] = useLocalStorage(
    'musica-settings-blur',
    true,
  );
  const [status, setStatus] = useState('ready');

  const handleSelectFolder = () => {
    window.electron.library.select();
    // TODO Toast
    // alert('Loading');
  };

  const libraryValues = Object.values(library);
  const totalArtists = libraryValues?.length || 0;
  const totalAlbums = libraryValues?.reduce(
    (prev, current) => current.albums.length + prev,
    0,
  );

  const totalTracks = libraryValues?.reduce((acc, artist) => {
    const numTracks = artist.albums.reduce(
      (albumAcc, album) => albumAcc + album.tracks.length,
      0,
    );
    return acc + numTracks;
  }, 0);

  const totalDuration = libraryValues?.reduce((acc, artist) => {
    const albumDuration = artist.albums.reduce((albumAcc, album) => {
      const trackDuration = album.tracks.reduce(
        (trackAcc, track) => trackAcc + track.duration,
        0,
      );
      return albumAcc + trackDuration;
    }, 0);
    return acc + albumDuration;
  }, 0);

  const stats = [
    {
      text: 'Artists',
      value: totalArtists,
    },
    {
      text: 'Albums',
      value: totalAlbums,
    },
    {
      text: 'Tracks',
      value: totalTracks,
    },
    {
      text: 'Duration',
      value: formatTotalTime(totalDuration),
    },
  ];

  useEffect(() => {
    window.electron.library.loading((event: any) => {
      setStatus('loading');
    });

    window.electron.library.parsed((event: any, data: any) => {
      // TODO: Toasts
      if (data.status === 'success') {
        setLibraryPath(data.path);
        setStatus('ready');
        //alert('Done');
      } else {
        setStatus('error');
        //alert(data.error);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="page-settings">
      <GoBack />
      <div className="flex flex-col">
        <h2 className="mb-5 text-3xl font-bold">Settings</h2>
        <section id="library" className="mb-5">
          <h3 className="mb-3 text-2xl font-bold">Library</h3>

          <section id="library-location" className="mb-4">
            <h4 className="mb-3 text-xl font-bold">Location</h4>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className={`btn-sm btn ${status}`}
                onClick={handleSelectFolder}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Loading...' : 'Select library folder'}
              </button>
              <p className="opacity-75">{libraryPath}</p>
            </div>
          </section>

          {totalArtists > 0 && (
            <section id="library-stats" className="mb-4">
              <div className="stats bg-neutral-content/5 shadow-lg">
                {stats.map((stat, index) => (
                  <div className="stat" key={index}>
                    <div className="stat-title text-sm">{stat.text}</div>
                    <div className="font-bold">{stat.value}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </section>

        <section id="general" className="mb-5">
          <h3 className="mb-3 text-2xl font-bold">General</h3>
          <section id="general-theme" className="mb-4">
            <h4 className="mb-3 text-xl font-bold">Theme</h4>
            <div className="flex items-center gap-4">
              <ToggleTheme />
              <p className="opacity-75">Toggle theme</p>
            </div>
          </section>
          <section id="general-toggle" className="mb-4">
            <h4 className="mb-3 text-xl font-bold">Blur</h4>
            <div className="flex items-center gap-4">
              <label className="label cursor-pointer">
                <span className="label-text hidden">Enable blur</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={blurEnabled}
                  onChange={() => setBlurEnabled((v) => !v)}
                />
              </label>
              <p className="opacity-75">Toggle blur</p>
            </div>
          </section>
        </section>

        <footer className="mt-auto flex items-center gap-2">
          <Play />
          <div className="text-sm">
            Musica{' '}
            <span className="badge badge-sm">v{packageJson.version}</span>
          </div>
          <div className="text-sm opacity-50">Made by: Derian Castillo</div>
        </footer>
      </div>
    </main>
  );
};

export default PageSettings;
