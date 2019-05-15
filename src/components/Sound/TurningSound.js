//
// Turn request sound
//

import React, { memo, forwardRef } from 'react';

const TURNING_SOUND = `${process.env.PUBLIC_URL}/turningSound.mp3`;

export const TurningSound = forwardRef((props, ref) => {
  return (
    <audio ref={ref} data-testid="turning-audio">
      <source src={TURNING_SOUND} preload="auto" />
    </audio>
  );
});

export default memo(TurningSound);
