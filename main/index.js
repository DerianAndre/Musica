const Utils = require('./utils');
const Parser = require('./utils/parser');

// Native
const fs = require('fs');
const { join } = require('path');
const { format } = require('url');

// Packages
const {
  BrowserWindow,
  app,
  ipcMain,
  dialog,
  protocol,
  nativeTheme,
} = require('electron');
const isDev = require('electron-is-dev');
const prepareNext = require('electron-next');

let mainWindow;

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer');

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: 'icon.ico',
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#101520' : '#FFFFFF',
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: join(__dirname, 'preload.js'),
    },
  });

  !isDev && mainWindow.removeMenu();

  const url = isDev
    ? 'http://localhost:8000'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      });

  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''));
    callback(pathname);
  });

  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

// Dialog
ipcMain.on('library-select', async (event) => {
  const folderPath = dialog.showOpenDialogSync({
    properties: ['openDirectory'],
  });

  if (!folderPath || !folderPath.length) return;

  console.log(`[i] Electron: Event <library-select> "${folderPath[0]}"`);

  Parser.parseLibrary(
    folderPath[0],
    'library',
    'index.json',
    (done, error = null) => {
      if (done) {
        event.sender.send('library-parsed', {
          status: 'success',
          path: folderPath[0],
          error: null,
        });
      } else {
        event.sender.send('library-parsed', {
          status: 'error',
          path: folderPath[0],
          error,
        });
      }
    },
  );
});

ipcMain.on('player-play-file', async (event, payload) => {
  console.log(`[i] Electron: Event <player-play-file> "${payload?.slug}"`);
  await Utils.readFile(payload, event);
});

ipcMain.on('player-event', async (event, data) => {
  console.log(`[i] Electron: Player event <${JSON.stringify(data)}>`);
  event.sender.send('player-on', data);
});
