/* eslint-disable @next/next/no-img-element */
import React from 'react';

const ListCover = ({ album = {}, width, rounded = false }) => {
  const getImage = () => {
    const skeleton =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    try {
      if (!album || !album.cover) return skeleton;
      return require(`~/library/cache/${album?.cover}`).default.src;
    } catch (error) {
      return skeleton;
    }
  };
  return (
    <div className="list-cover block w-full" style={{ maxWidth: width }}>
      <img
        className={`block aspect-[1/1] w-full select-none border border-base-content/[0.05] bg-base-300 text-[0] shadow-lg ${
          rounded && 'rounded-full'
        }`}
        alt={album?.title || ''}
        src={getImage()}
        width={width}
      />
    </div>
  );
};

export default ListCover;
