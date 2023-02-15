const sortBy = (array = [], prop = "title", val = "asc") => {
  array?.sort((a, b) => {
    if (!prop) return;

    if (a[prop] < b[prop]) {
      return val == "asc" ? -1 : 1;
    }

    if (a[prop] > b[prop]) {
      return val == "asc" ? 1 : -1;
    }

    return 0;
  });
};

const timeFormat = (totalSeconds) => {
  if (!totalSeconds) return;
  const min = Math.floor(totalSeconds / 60);
  const sec = Math.floor(totalSeconds % 60);
  const minutes = min < 10 ? `0${min}` : `${min}`;
  const seconds = sec < 10 ? `0${sec}` : `${sec}`;
  return `${minutes}:${seconds}`;
};

export { sortBy, timeFormat };
