const PageTrack = ({
  params,
}: {
  params: { artist: string; album: string; track: string };
}) => {
  const { artist, album, track } = params;

  return (
    <div>
      {artist}/{album}/{track}
    </div>
  );
};

export default PageTrack;
