import PLAYER_STATES from "../constants";

const PlayerInfo = ({ state, metadata }) => {
  const playerArtImage = (object) => {
    if (object?.data) {
      return URL.createObjectURL(
        new Blob([object?.data], { type: object?.data?.format })
      );
    } else {
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    }
  };

  return (
    <div className="track-info flex-1">
      <div className=" flex items-center justify-start gap-3">
        <figure className="art select-none swap">
          <img
            className={`d-block rounded-sm max-w-none ${
              state === PLAYER_STATES.PLAY && "shadow-inner"
            }`}
            src={playerArtImage(metadata?.common?.picture?.[0])}
            width="75px"
            height="75px"
          />
        </figure>
        {metadata?.common?.title && (
          <div className="info font-display">
            <h2 className="font-headings font-bold text-md">
              {metadata?.common?.title}
            </h2>
            <h3 className="font-medium text-xs text-clip text-ellipsis opacity-60 w-full">
              <span>{metadata?.common?.artist}</span>
              <span> • </span>
              <span>{metadata?.common?.album}</span>
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerInfo;
