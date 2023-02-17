import loadChunk from './chunks';

const loadLibrary = async ({ mode = 'full', setLibrary, setStatus }) => {
  if (mode === 'full') {
    await loadFull({ setLibrary, setStatus });
    return;
  }
  await loadChunks({ setLibrary, setStatus });
  return;
};
const loadFull = async ({ setLibrary, setStatus }) => {
  try {
    setStatus('loading');
    await import(`./index.json`)
      .then((data) => {
        setLibrary(data?.default);
        setStatus('ready');
      })
      .catch((error) => {
        setStatus('error');
        console.error(error);
      });
  } catch (error) {
    setStatus('error');
    console.error(error);
  }
};

const loadChunks = async ({ setLibrary, setStatus }) => {
  try {
    let list = [];

    await import(`./list.json`)
      .then((data) => {
        list = data?.default;
        setStatus('loading');
      })
      .catch((error) => {
        console.error(error);
      });

    try {
      list?.forEach(
        async (chunk) =>
          chunk && (await loadChunk({ chunk, setter: setLibrary })),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setStatus('ready');
    }
  } catch (error) {
    console.log(error);
  }
};

export default loadLibrary;
