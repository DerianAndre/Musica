import React from 'react';
import ListAll from './list-all';
import ListArtists from './list-artists';
import ListAlbums from './list-albums';
import ListTracks from './list-tracks';

interface IProps {
  mode: string;
}

const List = ({ mode }: IProps) => {
  const components: any = {
    tracks: <ListTracks />,
    artists: <ListArtists single />,
    albums: <ListAlbums />,
    list: <ListAll />,
  };

  return components[mode];
};

export default List;
