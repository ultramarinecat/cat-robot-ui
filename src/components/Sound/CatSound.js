//
// Cat sound
//

import React, { memo, forwardRef } from 'react';

export const CAT_SOUND = `${process.env.PUBLIC_URL}/catSound.mp3`;

export const CatSound = forwardRef((props, ref) => {
  return (
    <audio ref={ref} data-testid="cat-audio">
      <source src={CAT_SOUND} preload="auto" />
    </audio>
  );
});

export default memo(CatSound);
