const handlePlay = (data: void): void => {
  window.electron.player.play(data);
};

export { handlePlay };
