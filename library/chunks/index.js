const loadChunk = async ({ chunk, setLibrary }) => {
  if (!chunk || !Object.keys(chunk).length) return;

  return new Promise((resolve, reject) => {
    import(`./${chunk.file}.json`)
      .then((data) => {
        setLibrary((old) => ({ ...old, [chunk.artist]: data?.default }));
        resolve(true);
      })
      .catch((error) => {
        console.error(error);
        reject(false);
      });
  });
};

export default loadChunk;
