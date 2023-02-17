const loadChunk = async ({ chunk = {}, slug = '', setter = () => {} }) => {
  if (!slug && (!chunk || !Object.keys(chunk).length)) return;

  return new Promise((resolve, reject) => {
    import(`./${chunk?.file || slug}.json`)
      .then((data) => {
        if (setter) {
          setter((old) => ({
            ...old,
            [chunk?.artist || 'chunk']: {
              slug: chunk?.file || slug | '',
              ...data?.default,
            },
          }));
        }
        resolve({ slug: chunk?.file || slug || '', ...data?.default });
      })
      .catch((error) => {
        console.error(error);
        reject({});
      });
  });
};

export default loadChunk;
