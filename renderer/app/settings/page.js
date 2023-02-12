"use client";

import React, { useEffect, useState } from "react";

const Settings = () => {
  const [path, setPath] = useState("C:\\");

  const handleSelectFolder = () => {
    window.electron.dialog.open();
  };

  useEffect(() => {
    window.electron.dialog.on((event, data) => {
      if (data.path) {
        setPath(data.path);
      }
    });
  }, []);

  return (
    <button className="btn" onClick={handleSelectFolder}>
      Select Folder
    </button>
  );
};

export default Settings;
