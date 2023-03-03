/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { getImage } from '~/renderer/utils';
import { Album } from '~/types';

interface IProps {
  album?: Album | null;
  width?: string | number;
  rounded?: boolean;
}

const ListCover = ({ album, width, rounded = false }: IProps) => {
  return (
    <img
      className={`cover-art block aspect-[1/1] w-full select-none border border-base-content/[0.05] bg-base-300 text-[0] shadow-lg ${
        rounded ? 'rounded-full' : ''
      }`}
      alt={album?.title || ''}
      src={getImage(album?.cover)}
      style={{ maxWidth: width }}
    />
  );
};

export default ListCover;
