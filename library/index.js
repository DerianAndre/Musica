import loadChunk from "./chunks";

const loadLibrary = async ({ setLibrary }) => {
  try {
    let list = [];

    await import(`./list.json`)
      .then((data) => {
        list = data?.default;
      })
      .catch((error) => {
        console.error(error);
      });

    list?.forEach(
      async (chunk) => chunk && (await loadChunk({ chunk, setLibrary }))
    );
  } catch (error) {
    console.log(error);
  }
};

export default loadLibrary;
