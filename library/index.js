import loadChunk from './chunks';

const loadLibrary = async ({ mode = 'full', setLibrary, setLibraryStatus }) => {
  if (mode === 'chunks') {
    await loadChunks({ setLibrary, setLibraryStatus });
    return;
  }
  await loadFull({ setLibrary, setLibraryStatus });
  return;
};

const loadList = async ({ setList, setListStatus }) => {
  try {
    setListStatus('loading');
    await import(`./list.json`)
      .then((data) => {
        const json = data?.default;
        setList(data?.default);
        if (Object.keys(json).length === 0) {
          setListStatus('empty');
          return;
        }
        setListStatus('ready');
      })
      .catch((error) => {
        setListStatus('error');
        console.error(error);
      });
  } catch (error) {
    setListStatus('error');
    console.error(error);
  }
};

const loadFull = async ({ setLibrary, setLibraryStatus }) => {
  try {
    setLibraryStatus('loading');
    await import(`./index.json`)
      .then((data) => {
        const json = data?.default;
        setLibrary(data?.default);
        if (Object.keys(json).length === 0) {
          setLibraryStatus('empty');
          return;
        }
        setLibraryStatus('ready');
      })
      .catch((error) => {
        setLibraryStatus('error');
        console.error(error);
      });
  } catch (error) {
    setLibraryStatus('error');
    console.error(error);
  }
};

const loadChunks = async ({ setLibrary, setLibraryStatus }) => {
  try {
    let list = [];

    await import(`./list.json`)
      .then((data) => {
        list = data?.default;
        setLibraryStatus('loading');
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
      setLibraryStatus('ready');
    }
  } catch (error) {
    console.log(error);
  }
};

export default loadLibrary;

export { loadList };
