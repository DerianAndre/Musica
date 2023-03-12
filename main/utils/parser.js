const fs = require('fs');
const path = require('path');
const Utils = require('./index');
const MM = require('music-metadata');
const { getCoverFile, slugify } = require('./index');

let jsonLibrary = {};
const createChunks = false;

const supportedExtensions = [
  'aac',
  'aiff',
  'dsf',
  'flac',
  'alac',
  'm4a',
  'mp3',
  'ogg',
  'opus',
  'wav',
  'wv',
];

const checkArtistExists = (artistKey) => {
  return !!jsonLibrary[artistKey];
};

const checkAlbumExists = (artistKey, albumTitle) => {
  if (!checkArtistExists(artistKey)) return;

  const albumExists = jsonLibrary[artistKey]?.albums?.some(
    (album) => album.title === albumTitle,
  );

  return !!albumExists;
};

const checkTrackExists = (albumObject, trackTitle) => {
  if (!albumObject) return;

  const trackExists = albumObject.tracks.some(
    (track) => track.title === trackTitle,
  );

  return !!trackExists;
};

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
      const albumPath = path.dirname(filePath);
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
          albumartist = null,
          title = 'Unknown Title',
          track = '00',
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
          sampleRate = 0,
          bitsPerSample = 0,
        } = format;

        const trackNo = track.no ? track.no : 1;

        const trackPadded = formatTrackNo(trackNo);

        const trackSlug = slugify(
          `${artist}_${year}_${album}_${trackPadded}_${title}_${fileExtension}`,
        );

        const trackObject = {
          slug: trackSlug,
          trackNo,
          track: trackPadded,
          artist,
          artists,
          album,
          albumArtist: albumartist,
          title,
          genre,
          year,
          duration,
          path: filePath,
          extension: fileExtension,
          container,
          codec,
          bitRate: bitrate,
          sampleRate,
          bitsPerSample,
        };

        const artistKey = albumartist || artist;

        // Artist
        if (!checkArtistExists(artistKey)) {
          console.log(`[i] Library parser: Added new artist "${artistKey}"`);
          jsonLibrary[artistKey] = {
            slug: slugify(artist),
            title: artist,
            albums: [],
          };
        }

        // Album
        if (!checkAlbumExists(artistKey, album)) {
          console.log(
            `[i] Library parser: Added new album "${album}" to "${artistKey}"`,
          );

          const coverPath = getCoverFile({ artist, album, year, cover });

          jsonLibrary[artistKey].albums.push({
            slug: slugify(album),
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
            tracks: [trackObject],
            path: albumPath,
          });
          saveCover(coverPath, cover);
        }

        // Track
        const currentAlbum = jsonLibrary[artistKey].albums.find(
          (a) => a.title === album,
        );
        if (!checkTrackExists(currentAlbum, title)) {
          console.log(
            `[i] Library parser: Added new track "${title}" to album "${album}" to "${artistKey}"`,
          );
          currentAlbum.tracks.push(trackObject);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
};

const saveCover = (coverPath, cover) => {
  const cachePath = './library/cache';
  const filePath = cachePath + '/' + coverPath;

  Utils.checkFolder(cachePath, false);

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

  const libraryData = fs.readFileSync('./library/index.json');

  jsonLibrary = JSON.parse(libraryData);

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
      console.log(`[i] Library parser: Saved to "${libraryFullPath}"`);

      // Chunks
      console.log(
        `[i] Library parser: Creating chunks "${libraryPath}/chunks> ...`,
      );
      const chunksList = [];
      Object.keys(jsonLibrarySorted).forEach((item) => {
        const chunkPath = `${libraryPath}/chunks/`;
        const chunkSlug = slugify(item);
        const chunkFile = `${chunkSlug}.json`;
        const chunkFullPath = chunkPath + chunkFile;

        chunksList.push({
          artist: item,
          slug: chunkSlug,
          file: chunkFile,
          path: chunkFullPath,
        });

        if (createChunks) {
          fs.promises.writeFile(
            chunkFullPath,
            JSON.stringify(jsonLibrarySorted[item], null, 2),
          );
        }
      });

      if (createChunks) {
        console.log(`[i] Library parser: Saved chunks`);
      }
      // Chunk list
      console.log(
        `[i] Library parser: Creating chunks list "${libraryPath}/list.json> ...`,
      );
      fs.promises.writeFile(
        `${libraryPath}/list.json`,
        JSON.stringify(chunksList, null, 2),
      );
      console.log(`[i] Library parser: Saved chunks list.`);

      callback(true, null);
    }
  } catch (error) {
    callback(true, error);
  } finally {
    console.timeEnd(`[i] Library parser: Total time`);
  }
};

module.exports = {
  parseLibrary,
};
