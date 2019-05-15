import React, { forwardRef } from 'react';

export const playCat = jest.fn();
const pause = jest.fn();

const CatSound = forwardRef((props, ref) => {
  ref.current = {
    play: playCat,
    pause
  };

  return <div data-testid="cat-audio" />;
});

export default CatSound;
