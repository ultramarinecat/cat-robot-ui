//
// Sound component
// Displays mute button, plays cat and turning sounds
//

import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import CatSound from './CatSound.js';
import TurningSound from './TurningSound.js';
import Mute from './Mute.js';

export function Sound({ playCatSound, playTurningSound, updateSound }) {
  // update even if sounds haven't changed
  const [muted, setMuted] = useState(true);

  const catSound = useRef();
  const turningSound = useRef();
  const isInitialClick = useRef(true);

  useEffect(() => {
    if (muted || (!playCatSound && !playTurningSound)) {
      return;
    }

    playSound(playCatSound ? catSound.current : turningSound.current);
  }, [playCatSound, playTurningSound, updateSound]);

  const handleClick = useCallback(() => {
    setMuted(isMuted => {
      // toggle mute setting, play turning sound if unmuting
      if (isMuted) {
        playSound(turningSound.current);
      }
      return !isMuted;
    });

    // user interaction required to play audio
    if (isInitialClick.current) {
      isInitialClick.current = false;
      playSound(catSound.current, true);
    }
  });

  return (
    <>
      <CatSound ref={catSound} />
      <TurningSound ref={turningSound} />

      <Mute isMuted={muted} onClick={handleClick} />
    </>
  );
}

function playSound(sound, muted = false) {
  sound.pause();
  sound.currentTime = 0;
  sound.muted = muted;

  sound.play();
}

Sound.propTypes = {
  playCatSound: PropTypes.bool,
  playTurningSound: PropTypes.bool,
  updateSound: PropTypes.bool
};

export default memo(Sound);
