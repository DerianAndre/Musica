"use client";

import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import Loader from "../../components/loader";

const Settings = () => {
  const [libraryPath, setLibraryPath] = useLocalStorage("libraryPath", null);
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
      {status === "ready" && (
        <button className="btn btn-sm" onClick={handleSelectFolder}>
          Select Folder
        </button>
      )}

      {libraryPath && (
        <div>
          <p className="font-bold">Library path:</p>
          <p>{libraryPath}</p>
        </div>
      )}

      {status === "loading" && <Loader />}
    </div>
  );
};

export default Settings;
