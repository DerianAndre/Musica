"use client";

import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Loader from "../../components/loader";

const Settings = () => {
  const [libraryPath, setLibraryPath] = useLocalStorage(
    "libraryPath",
    "<No folder selected>"
  );
  const [status, setStatus] = useState("ready");

  const handleSelectFolder = () => {
    window.electron.library.select();
    setStatus("loading");
  };

  useEffect(() => {
    window.electron.library.parsed((event, data) => {
      if (data.status === "success") {
        setLibraryPath(data.path);
        setStatus("ready");
      } else {
        setStatus("error");
      }
    });
  }, []);

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-2xl mb-3">Settings</h2>
      <div className="divide-y divide-slate-700">
        <section className="my-3 py-2">
          <h3 className="font-bold text-xl mb-3">Library</h3>
          <div className="flex items-center justify-between">
            <div className="block">
              <p className="font-bold">Music library location</p>
              <p className="opacity-75">{libraryPath}</p>
            </div>
            <button
              className={`btn btn-sm ${status}`}
              onClick={handleSelectFolder}
            >
              Select library folder
            </button>
          </div>
        </section>
        <section></section>
      </div>
      <div className="text-sm mt-5 opacity-50">Derian Castillo</div>
    </div>
  );
};

export default Settings;
