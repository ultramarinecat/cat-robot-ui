import React from 'react';
import { render } from 'react-testing-library';

import { CatSound, CAT_SOUND } from '../CatSound.js';

const CAT_AUDIO = 'cat-audio';

describe('Cat sound', () => {
  it('should play a cat sound', () => {
    const { container, getByTestId } = render(<CatSound />);
    const catAudio = getByTestId(CAT_AUDIO);

    expect(catAudio).toBeInTheDocument();
    expect(catAudio.firstChild).toHaveAttribute('src', CAT_SOUND);

    expect(container.firstChild).toMatchSnapshot();
  });
});
