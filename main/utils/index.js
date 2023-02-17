const { slugifyFile } = require("./files");
const MM = require("music-metadata");

const getCoverFile = ({ artist, album, year, cover }) => {
  const ext = cover.format.replace("image/", "");
  return `${slugifyFile(artist)}_${year}_${slugifyFile(album)}.${ext}`;
};

const readFile = async (payload, event) => {
  if (!payload || !payload.path) return;
  try {
    const result = await readMetadata(payload?.path);
    if (result.metadata) {
      event.sender.send("player-file-metadata", {
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

module.exports = { getCoverFile, slugifyFile, readFile, readMetadata };
