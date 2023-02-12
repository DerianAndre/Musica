const fs = require("fs");
const path = require("path");
const MM = require("music-metadata");
const { getCoverFile } = require("./index");

const supportedExtensions = [
  "aac",
  "aiff",
  "dsf",
  "flac",
  "m4a",
  "mp3",
  "ogg",
  "opus",
  "wav",
  "wv",
];

const jsonLibrary = {};

const formatTrackNo = (num, targetLength = 2) => {
  return Number(num).toString().padStart(targetLength, "0");
};

const walk = async (root) => {
  const files = await fs.promises.readdir(root);
  for (const file of files) {
    const filePath = path.join(root, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      await walk(filePath);
    } else {
      const fileExtension = filePath.split(".").slice(-1)[0];
      if (!supportedExtensions.includes(fileExtension)) continue;
      try {
        const { common: metadata } = await MM.parseFile(filePath);
        const cover = MM.selectCover(metadata.picture);
        const {
          album = "Unknown Album",
          artist = "Unknown Artist",
          title = "Unknown Title",
          track = "??",
          genre = "Unknown Genre",
          year = null,
          date = null,
        } = metadata;
        const trackNo = track.no ? track.no : date;
        const musicFileObject = {
          track: formatTrackNo(trackNo),
          artist: artist,
          album: album,
          title: title,
          genre: genre,
          extension: fileExtension,
          path: filePath,
        };

        const coverPath = getCoverFile({ artist, album, year, cover });

        if (!jsonLibrary[artist]) {
          jsonLibrary[artist] = { albums: [] };
        }

        let albumIndex = -1;
        for (let i = 0; i < jsonLibrary[artist].albums.length; i++) {
          if (jsonLibrary[artist].albums[i].title === album) {
            albumIndex = i;
            break;
          }
        }

        if (albumIndex === -1) {
          jsonLibrary[artist].albums.push({
            title: album,
            year: year || date || "????",
            cover: coverPath,
            tracks: [musicFileObject],
          });
        } else {
          jsonLibrary[artist].albums[albumIndex].tracks.push(musicFileObject);
        }

        saveCover(coverPath, cover);
      } catch (err) {
        console.error(err);
      } finally {
      }
    }
  }
};

const saveCover = (coverPath, cover) => {
  const cachePath = "./cache";
  const filePath = cachePath + "/" + coverPath;

  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }

  if (!fs.existsSync(filePath)) {
    console.log(`[i] Library parser: Saving cover in cache ${filePath}`);
    fs.promises.writeFile(filePath, cover.data);
  } else {
    // console.log(`[i] Library parser: Cover already exists`);
  }
};

const main = async (dir, libraryFile) => {
  console.log(`[i] Library parser: Init...`);
  console.time(`[i] Library parser: Total time`);
  try {
    const files = await fs.promises.readdir(dir);
    const promises = files.map(async (file) => {
      const filepath = path.join(dir, file);
      const stat = await fs.promises.stat(filepath);
      if (stat.isDirectory()) {
        return fs.promises
          .readdir(filepath)
          .then((files) => walk(filepath, files));
      }
      return await Promise.resolve();
    });
    await Promise.all(promises);
  } catch (err) {
    console.error(err);
  }

  if (Object.keys(jsonLibrary).length === 0) {
    console.log(`[i] Library parser: No items found`);
    return;
  }

  console.log(`[i] Library parser: Sorting...`);

  const jsonLibrarySorted = Object.fromEntries(
    Object.entries(jsonLibrary).sort((a, b) =>
      a[0].toLowerCase().localeCompare(b[0].toLowerCase())
    )
  );

  console.log(
    `[i] Library parser: Saving ${
      Object.keys(jsonLibrarySorted).length
    } item/s...`
  );

  if (Object.keys(jsonLibrarySorted).length > 0) {
    fs.promises.writeFile(libraryFile, JSON.stringify(jsonLibrarySorted));
    console.log(`[i] Library parser: Saved to ${libraryFile}`);
  }
  console.timeEnd(`[i] Library parser: Total time`);
};

main("D:\\Música", "library.json");
