const MM = require("music-metadata");

const getCoverFile = ({ artist, album, year, cover }) => {
  const ext = cover.format.replace("image/", "");
  return `${slugifyFile(artist)}_${year}_${slugifyFile(album)}.${ext}`;
};

const slugifyFile = (string) => {
  return String(string)
    .toString()
    .toLowerCase()
    .replaceAll("ｃ", "c") // TODO better way to do this...
    .replaceAll("ｄ", "d")
    .replaceAll("ｅ", "e")
    .replaceAll("ｈ", "h")
    .replaceAll("ｏ", "o")
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

const readFile = async (file, event) => {
  try {
    const result = await readMetadata(file);
    if (result.metadata) {
      event.sender.send("player-file-metadata", result.metadata);
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
