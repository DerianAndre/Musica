import { slider } from "./index.module.scss";
const PlayerSeeker = ({
  sliderTime,
  sliderValue,
  timeCurrent,
  timeDuration,
  handleSliderTime,
}) => {
  return (
    <div className="player-seeker">
      <div className="flex gap-6 mb-2">
        <div className="flex flex-none items-center justify-start">
          <span className="text-xs">{timeCurrent}</span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div
            className={slider}
            style={{ "--slider-value": `${sliderValue}%` }}
          >
            <input
              ref={sliderTime}
              type="range"
              value={sliderValue}
              min={0}
              max={100}
              step={0.05}
              onChange={handleSliderTime}
            />
          </div>
        </div>
        <div className="flex flex-none items-center justify-end">
          <span className="text-xs">{timeDuration}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerSeeker;
