import React, { useState, useEffect, useRef } from "react";
import { Howl, Howler } from "howler";

const Home = () => {
  const [path, setPath] = useState("C:\\");
  const [files, setFiles] = useState([]);
  const [metadata, setMetadata] = useState(false);
  const [status, setStatus] = useState("ready");

  const playerImage = (object) => {
    if (object.data) {
      return URL.createObjectURL(
        new Blob([object.data], { type: object.data.format })
      );
    } else {
      return "";
    }
  };

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

    window.electron.player.metadata((event, data) => {
      console.log(data);
      setMetadata(data);
    });
  }, []);

  return (
    <div>
      <h1>Musica</h1>

      <div>
        {metadata ? (
          <>
            <p>Info</p>
            <ul>
              <li>Path: {path}</li>
              <li>File: {metadata?.file}</li>
              <li>Year: {metadata?.common?.year}</li>
              <li>Album: {metadata?.common?.album}</li>
              <li>Artist: {metadata?.common?.artist}</li>
              <li>Title: {metadata?.common?.title}</li>
            </ul>
            <img
              src={playerImage(metadata?.common?.picture?.[0])}
              width="200px"
              height="200px"
            />
            <br />
            {metadata && metadata.file && metadata.format && (
              <audio controls>
                <source src={metadata?.file} type="audio/flac" />
              </audio>
            )}
          </>
        ) : (
          <>Nothing to play</>
        )}
        <ul>
          {files?.map((file) => (
            <li key={file.path}>
              {file.path}: {JSON.stringify(file.metadata)}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleSelectFolder}>Select Folder</button>
      <button onClick={handlePlay}>Play</button>
    </div>
  );
};
export default Home;
