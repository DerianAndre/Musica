/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { getImage } from '~/renderer/utils';

const ListCover = ({ album = {}, width, rounded = false }) => {
  return (
    <img
      className={`cover-art block aspect-[1/1] w-full select-none border border-base-content/[0.05] bg-base-300 text-[0] shadow-lg ${
        status.current
      } ${rounded ? 'rounded-full' : ''}`}
      alt={album?.title || ''}
      src={getImage(album?.cover)}
      style={{ maxWidth: width }}
    />
  );
};

export default ListCover;
