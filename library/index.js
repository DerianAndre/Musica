import loadChunk from './chunks';

const loadLibrary = async ({ setLibrary, setStatus }) => {
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
