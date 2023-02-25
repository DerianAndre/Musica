import React from 'react';
import ListAll from './list-all/index';
import ListArtists from './list-artists';
import ListAlbums from './list-albums';
import ListTracks from './list-tracks';
import { Library, Track } from '~/types';

interface IProps {
  library: Library;
  tracks: Track[];
  mode: string;
}

const List = ({ library, tracks, mode }: IProps) => {
  if (!library) return;

  const components: any = {
    tracks: <ListTracks tracks={tracks} />,
    artists: <ListArtists library={library} />,
    albums: <ListAlbums library={library} />,
    list: <ListAll library={library} />,
  };

  return components[mode];
};

export default List;
