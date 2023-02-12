"use client";

import "../scss/globals.scss";
import library from "../../library.json";

import React, { useState, useEffect } from "react";
import { Shuffle } from "../components/icons";
import { List, Loader } from "../components";
import { handlePlayRandom } from "../utils/random";

const Home = () => {
  const [status, setStatus] = useState("ready");
  //const [library, setLibrary] = useState({});

  const handlePlay = (file) => {
    window.electron.player.play(file);
  };

  // const load = async () => {
  //   const importLibrary = await import("../../library.json", {
  //     assert: { type: "json" },
  //   });
  //   setLibrary(importLibrary.default);
  //   setStatus("ready");
  // };

  // useEffect(() => {
  //   if (Object.keys(library).length > 0) return;
  //   load();
  // }, []);

  return (
    <div className="flex flex-col">
      <div className="flex gap-3 mb-5">
        <button
          className="btn btn-sm gap-2"
          onClick={() => handlePlayRandom(library, handlePlay)}
        >
          <Shuffle /> Random play
        </button>
      </div>

      {status === "loading" && <Loader />}
      {status === "ready" && (
        <List library={library} handlePlay={handlePlay} show={false} />
      )}
    </div>
  );
};

export default Home;
