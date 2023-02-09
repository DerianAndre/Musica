const Utils = require("./utils");

// Native
const fs = require("fs");
const { join } = require("path");
const { format } = require("url");

// Packages
const { BrowserWindow, app, ipcMain, dialog, protocol } = require("electron");
const isDev = require("electron-is-dev");
const prepareNext = require("electron-next");

let mainWindow;

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: join(__dirname, "preload.js"),
    },
  });

  const url = isDev
    ? "http://localhost:8000"
    : format({
        pathname: join(__dirname, "../renderer/out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  protocol.registerFileProtocol("file", (request, callback) => {
    const pathname = decodeURI(request.url.replace("file:///", ""));
    callback(pathname);
  });

  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("message", (event, message) => {
  event.sender.send("message", message);
});

// Read files
/*
ipcMain.on("read-file", (event, filePath) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const metadata = extractMetadata(data);
    event.sender.send("file-metadata", metadata);
  });
}); */

// Dialog
ipcMain.on("select-folder-send", (event) => {
  const filePath = dialog.showOpenDialogSync({ properties: ["openDirectory"] });

  console.log("[i] Electron: select-folder-send", filePath);

  if (filePath) {
    event.sender.send("select-folder-on", { path: filePath[0], error: null });
  } else {
    event.sender.send("select-folder-on", {
      path: false,
      error: "No folder selected",
    });
  }
});

ipcMain.on("player-play-file", async (event, payload) => {
  console.log("[i] Electron: player-play-file", payload);
  await Utils.readFile(payload, event);
});
