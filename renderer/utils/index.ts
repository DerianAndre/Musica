const timeFormat = (totalSeconds: number) => {
  if (!totalSeconds) return;
  const min = Math.floor(totalSeconds / 60);
  const sec = Math.floor(totalSeconds % 60);
  const minutes = min < 10 ? `0${min}` : `${min}`;
  const seconds = sec < 10 ? `0${sec}` : `${sec}`;
  return `${minutes}:${seconds}`;
};

export { timeFormat };
