"use client";

import "../scss/globals.scss";
import library from "../../library.json";

import React, { useState, useEffect } from "react";
import { Shuffle } from "../components/icons";
import { List, Loader } from "../components";
import { handlePlayRandom } from "../utils/random";

const Home = () => {
  const [status, setStatus] = useState("ready");

  const handlePlay = (file) => {
    window.electron.player.play(file);
  };

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
        <List library={library} handlePlay={handlePlay} show={true} />
      )}
    </div>
  );
};

export default Home;
