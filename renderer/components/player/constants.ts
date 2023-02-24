const PLAYER_ACTIONS = {
  PLAY: 'PLAY',
  PAUSE: 'PAUSE',
  PLAYPAUSE: 'PLAYPAUSE',
  SHUFFLE: 'SHUFFLE',
  LOOP: 'LOOP',
  MUTE: 'MUTE',
  UNMUTE: 'UNMUTE',
};

const PLAYER_ERRORS = {
  1: "The fetching process for the media resource was aborted by the user agent at the user's request.",
  2: 'A network error of some description caused the user agent to stop fetching the media resource, after the resource was established to be usable.',
  3: 'An error of some description occurred while decoding the media resource, after the resource was established to be usable.',
  4: 'The media resource indicated by the src attribute or assigned media provider object was not suitable.',
};

const PLAYER_STATES = {
  PLAY: 'PLAY',
  PAUSE: 'PAUSE',
  STOP: 'STOP',
  END: 'END',
  ERROR: 'ERROR',
};

export { PLAYER_ACTIONS, PLAYER_ERRORS, PLAYER_STATES };
