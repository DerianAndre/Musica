"use client";

import "../scss/globals.scss";

import React, { useState, useEffect } from "react";

const Home = () => {
  const [path, setPath] = useState("C:\\");
  const [files, setFiles] = useState([]);
  const [metadata, setMetadata] = useState(false);
  const [status, setStatus] = useState("ready");

  const handleSelectFolder = () => {
    window.electron.dialog.open();
  };

  const handlePlay = () => {
    window.electron.player.play("C:\\test.flac");
  };

  useEffect(() => {
    window.electron.dialog.on((event, data) => {
      if (data.path) {
        setPath(data.path);
      }
    });
  }, []);

  return (
    <div className="flex flex-col">
      <div className="div">
        <button className="btn" onClick={handleSelectFolder}>
          Select Folder
        </button>
        <button className="btn" onClick={handlePlay}>
          Play
        </button>
      </div>
    </div>
  );
};

export default Home;
