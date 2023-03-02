const fs = require('fs');
const { slugifyFile } = require('./files');
const MM = require('music-metadata');

const checkFolder = async (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    console.log(`[i] Electron: Path "${path}" created.`);
    return;
  }
  console.log(`[i] Electron: Path "${path}" exists.`);
};

const checkFile = async (path, file, content = '{}') => {
  const filePath = path + file;

  if (!fs.existsSync(filePath)) {
    fs.writeFile(filePath, content, (error) => {
      if (error) {
        console.log(
          `[i] Electron: Error with "${filePath}", message: ${error}.`,
        );
        return;
      }
      console.log(`[i] Electron: File "${filePath}" created.`);
    });
  } else {
    console.log(`[i] Electron: File "${filePath}" loaded.`);
  }
};

const checkLibrary = async () => {
  const libraryPath = './library/';
  await checkFolder(libraryPath);
  await checkFile(libraryPath, 'index.json');
  await checkFile(libraryPath, 'list.json', '[]');
};

const getCoverFile = ({ artist, album, year, cover }) => {
  const ext = cover.format.replace('image/', '');
  return `${slugifyFile(artist)}_${year}_${slugifyFile(album)}.${ext}`;
};

const readFile = async (payload, event) => {
  if (!payload || !payload.path) return;
  try {
    const result = await readMetadata(payload?.path);
    if (result.metadata) {
      event.sender.send('player-file-metadata', {
        data: payload,
        metadata: result.metadata,
      });
      return;
    }
  } catch (error) {
    console.log(`[e] Electron: readFile error: ${error}`);
  }
};

const readMetadata = async (file) => {
  try {
    const metadata = await MM.parseFile(file);
    return { metadata: { ...metadata, file }, error: null };
  } catch (error) {
    return { metadata: null, error };
  }
};

module.exports = {
  checkFile,
  checkFolder,
  checkLibrary,
  getCoverFile,
  slugifyFile,
  readFile,
  readMetadata,
};
