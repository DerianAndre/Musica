const MM = require("music-metadata");
const fs = require("fs");
const path = require("path");

const generateMusicData = async (rootPath) => {
  try {
    const musicData = [];

    const parentDirs = await fs.promises.readdir(rootPath, {
      withFileTypes: true,
    });
    console.log("parentDIrs", parentDirs);
    /**
    const readDirectory = async (dirPath, parentDir) => {
      const items = await fs.promises.readdir(dirPath, { withFileTypes: true });

      for (const item of items) {
        const itemPath = path.join(dirPath, item.name);

        if (item.isFile()) {
          const { name, ext } = path.parse(itemPath);
          parentDir.tracks.push({
            file: name,
            extension: ext.slice(1),
            path: itemPath,
          });
        } else if (item.isDirectory()) {
          const album = {
            title: item.name,
            path: itemPath,
            tracks: [],
          };
          parentDir.albums.push(album);
          await readDirectory(itemPath, album);
        }
      }
    };

    for (const parentDir of parentDirs) {
      if (parentDir.isDirectory()) {
        const artist = {
          artist: parentDir.name,
          path: path.join(rootPath, parentDir.name),
          albums: [],
        };
        musicData.push(artist);
        await readDirectory(path.join(rootPath, parentDir.name), artist);
      }
    }**/

    return musicData;
  } catch (error) {
    throw Error(error);
  }
};

const readFile = async (file, event) => {
  try {
    const result = await readMetadata(file);
    if (result.metadata) {
      console.log("[i] Electron: readFile", file);
      event.sender.send("player-file-metadata", result.metadata);
      return;
    }
  } catch (error) {
    console.log("[e] Electron: readFile");
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

module.exports = { generateMusicData, readFile, readMetadata };
