import React from 'react';
import { render } from 'react-testing-library';

import { TurningSound, TURNING_SOUND } from '../TurningSound.js';

const TURNING_AUDIO = 'turning-audio';

describe('Turning sound', () => {
  it('should play a turning sound', () => {
    const { container, getByTestId } = render(<TurningSound />);
    const turningAudio = getByTestId(TURNING_AUDIO);

    expect(turningAudio).toBeInTheDocument();
    expect(turningAudio.firstChild).toHaveAttribute('src', TURNING_SOUND);

    expect(container.firstChild).toMatchSnapshot();
  });
});
