const fs = require('fs');
const path = require('path');
const MM = require('music-metadata');
const { getCoverFile, slugifyFile } = require('./index');

const supportedExtensions = [
  'aac',
  'aiff',
  'dsf',
  'flac',
  'm4a',
  'mp3',
  'ogg',
  'opus',
  'wav',
  'wv',
];

const jsonLibrary = {};

const formatTrackNo = (num, targetLength = 2) => {
  return Number(num).toString().padStart(targetLength, '0');
};

const parseFolder = async (root) => {
  const files = await fs.promises.readdir(root);
  for (const file of files) {
    const filePath = path.join(root, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      await parseFolder(filePath);
    } else {
      const fileExtension = filePath.split('.').slice(-1)[0];
      if (!supportedExtensions.includes(fileExtension)) continue;
      try {
        const { common, format } = await MM.parseFile(filePath);

        const cover = MM.selectCover(common.picture);

        const {
          album = 'Unknown Album',
          albumsort = 'Unknown Album',
          artist = 'Unknown Artist',
          artists = ['Unknown Artist'],
          albumartist = 'Unknown Artist',
          title = 'Unknown Title',
          track = '??',
          genre = 'Unknown Genre',
          year = null,
          originalyear = null,
          date = null,
          originaldate = null,
        } = common;

        const {
          container = null,
          codec = null,
          duration = 0,
          bitrate = 0,
          samplerate = 0,
          bitsPerSample = 0,
        } = format;

        const trackNo = track.no ? track.no : date;

        const trackPadded = formatTrackNo(trackNo);

        const fileSlug = slugifyFile(
          `${artist}_${year}_${album}_${trackPadded}_${title}_${fileExtension}`,
        );

        const musicFileObject = {
          slug: fileSlug,
          trackNo,
          track: trackPadded,
          artist,
          albumartist,
          artists,
          album,
          title,
          genre,
          year,
          container,
          codec,
          duration,
          bitrate,
          samplerate,
          bitsPerSample,
          extension: fileExtension,
          path: filePath,
        };

        const coverPath = getCoverFile({ artist, album, year, cover });

        if (!jsonLibrary[albumartist]) {
          jsonLibrary[albumartist] = {
            slug: slugifyFile(artist),
            title: artist,
            albums: [],
          };
        }

        let albumIndex = -1;
        for (let i = 0; i < jsonLibrary[albumartist].albums.length; i++) {
          if (jsonLibrary[albumartist].albums[i].title === album) {
            albumIndex = i;
            break;
          }
        }

        if (albumIndex === -1) {
          jsonLibrary[albumartist].albums.push({
            slug: slugifyFile(album),
            title: album,
            artist,
            albumartist,
            albumsort,
            year: year || originalyear || date || originaldate || '????',
            originalyear,
            date: date || originaldate || '????',
            originaldate,
            genre,
            cover: coverPath,
            tracks: [musicFileObject],
          });
        } else {
          jsonLibrary[albumartist].albums[albumIndex].tracks.push(
            musicFileObject,
          );
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
  const cachePath = './library/cache';
  const filePath = cachePath + '/' + coverPath;

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

const parseLibrary = async (dir, libraryPath, libraryFile, callback) => {
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
          .then((files) => parseFolder(filepath, files));
      }
      return await Promise.resolve();
    });
    await Promise.all(promises);
  } catch (error) {
    console.error(error);
    callback(false, error);
  }

  if (Object.keys(jsonLibrary).length === 0) {
    console.log(`[i] Library parser: No items found`);
    return;
  }

  console.log(`[i] Library parser: Sorting...`);

  const jsonLibrarySorted = Object.fromEntries(
    Object.entries(jsonLibrary).sort((a, b) =>
      a[0].toLowerCase().localeCompare(b[0].toLowerCase()),
    ),
  );

  console.log(
    `[i] Library parser: Saving ${
      Object.keys(jsonLibrarySorted).length
    } item/s...`,
  );

  try {
    if (Object.keys(jsonLibrarySorted).length > 0) {
      // Library
      const libraryFullPath = `${libraryPath}/${libraryFile}`;
      fs.promises.writeFile(libraryFullPath, JSON.stringify(jsonLibrarySorted));
      console.log(`[i] Library parser: Saved to <${libraryFullPath}>`);

      // Chunks
      console.log(
        `[i] Library parser: Creating chunks <${libraryPath}/chunks> ...`,
      );
      const chunksList = [];
      Object.keys(jsonLibrarySorted).forEach((item) => {
        const chunkPath = `${libraryPath}/chunks/`;
        const chunkSlug = slugifyFile(item);
        const chunkFile = `${chunkSlug}.json`;
        const chunkFullPath = chunkPath + chunkFile;

        chunksList.push({
          artist: item,
          slug: chunkSlug,
          file: chunkFile,
          path: chunkFullPath,
        });

        fs.promises.writeFile(
          chunkFullPath,
          JSON.stringify(jsonLibrarySorted[item], null, 2),
        );
      });
      console.log(`[i] Library parser: Saved chunks`);

      // Chunk list
      console.log(
        `[i] Library parser: Creating chunks list <${libraryPath}/list.json> ...`,
      );
      fs.promises.writeFile(
        `${libraryPath}/list.json`,
        JSON.stringify(chunksList, null, 2),
      );
      console.log(`[i] Library parser: Saved chunks list.`);

      callback(true, null);
    }
  } catch (error) {
    callback(false, error);
  } finally {
    console.timeEnd(`[i] Library parser: Total time`);
  }
};

module.exports = {
  parseLibrary,
};
