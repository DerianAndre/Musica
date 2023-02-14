const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  library: {
    select: (payload) => ipcRenderer.send("library-select", payload),
    parsed: (handler) => ipcRenderer.on("library-parsed", handler),
  },
  player: {
    play: (payload) => ipcRenderer.send("player-play-file", payload),
    metadata: (handler) => ipcRenderer.on("player-file-metadata", handler),
    event: (payload) => ipcRenderer.send("player-event", payload),
    on: (handler) => ipcRenderer.send("player-on", handler),
  },
});
