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
    <img
      className={`cover-art block aspect-[1/1] w-full select-none border border-base-content/[0.05] bg-base-300 text-[0] shadow-lg ${
        status.current
      } ${rounded ? 'rounded-full' : ''}`}
      alt={album?.title || ''}
      src={getImage()}
      style={{ maxWidth: width }}
    />
  );
};

export default ListCover;
