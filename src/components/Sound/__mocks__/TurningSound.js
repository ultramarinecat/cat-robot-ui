import React, { forwardRef } from 'react';

export const playTurning = jest.fn();
const pause = jest.fn();

const TurningSound = forwardRef((props, ref) => {
  ref.current = {
    play: playTurning,
    pause
  };

  return <div data-testid="turning-audio" />;
});

export default TurningSound;
