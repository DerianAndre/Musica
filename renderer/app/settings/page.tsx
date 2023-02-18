'use client';

import React, { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import ToggleTheme from '~/renderer/components/theme-toggle';

const PageSettings = () => {
  const [libraryPath, setLibraryPath] = useLocalStorage(
    'musica-library-path',
    '<No folder selected>',
  );
  const [blurEnabled, setBlurEnabled] = useLocalStorage(
    'musica-blur-enabled',
    true,
  );
  const [status, setStatus] = useState('ready');

  const handleSelectFolder = () => {
    window.electron.library.select();
    // TODO Toast
    alert('Loading');
  };

  useEffect(() => {
    // TODO
    //window.electron.library.loading(() => {
    //  setStatus("loading");
    //});
    window.electron.library.parsed((event, data) => {
      if (data.status === 'success') {
        setLibraryPath(data.path);
        setStatus('ready');
      } else {
        setStatus('error');
      }
    });
  }, []);

  return (
    <main className="page-settings">
      <div className="flex flex-col">
        <h2 className="mb-3 text-2xl font-bold">Settings</h2>
        <div className="divide-y divide-base-300">
          <section className="my-3 py-2">
            <h3 className="mb-3 text-xl font-bold">Library</h3>
            <div className="flex items-center justify-between">
              <div className="block">
                <p className="font-bold">Music library location</p>
                <p className="opacity-75">{libraryPath}</p>
              </div>
              <button
                className={`btn-sm btn ${status}`}
                onClick={handleSelectFolder}
                disabled={status === 'loading'}
              >
                Select library folder
              </button>
            </div>
          </section>
          <section>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Enable blur</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={blurEnabled}
                  onChange={() => setBlurEnabled((v) => !v)}
                />
              </label>
            </div>
          </section>
        </div>
        <ToggleTheme />
        <div className="mt-5 text-sm opacity-50">Derian Castillo</div>
      </div>
    </main>
  );
};

export default PageSettings;
