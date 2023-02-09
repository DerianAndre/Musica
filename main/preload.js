const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  dialog: {
    open: (payload) => ipcRenderer.send("select-folder-send", payload),
    on: (handler) => ipcRenderer.on("select-folder-on", handler),
  },
  player: {
    play: (payload) => ipcRenderer.send("player-play-file", payload),
    metadata: (handler) => ipcRenderer.on("player-file-metadata", handler),
  },
});
