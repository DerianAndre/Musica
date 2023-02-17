import { slider } from "./index.module.scss";

const PlayerSeeker = ({
  sliderTime,
  sliderValue,
  timeCurrent,
  timeDuration,
  handleSliderTime,
}) => {
  return (
    <div className="player-seeker mb-3">
      <div className="flex">
        <div className="flex items-center justify-start w-14">
          <span className="font-headings font-medium text-xs block">
            {timeCurrent}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div
            className={slider}
            style={{ "--slider-value": `${sliderValue}%` }}
          >
            <input
              className="w-full"
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
        <div className="flex items-center justify-end w-14">
          <span className="font-headings font-medium text-xs block">
            {timeDuration}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerSeeker;
