const MM = require("music-metadata");

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

module.exports = { readFile, readMetadata };
