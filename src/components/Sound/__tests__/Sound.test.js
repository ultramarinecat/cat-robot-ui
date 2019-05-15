import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import { Sound } from '../Sound.js';
import { playCat } from '../CatSound.js';
import { playTurning } from '../TurningSound.js';

jest.mock('../CatSound');
jest.mock('../TurningSound');

const MUTE_BUTTON = 'mute';
const CAT_AUDIO = 'cat-audio';
const TURNING_AUDIO = 'turning-audio';

describe('Sound', () => {
  afterEach(() => {
    playCat.mockClear();
    playTurning.mockClear();
  });

  it('should play cat and turning sounds and display mute button', () => {
    const { getByTestId, container } = render(<Sound />);

    expect(getByTestId(CAT_AUDIO)).toBeInTheDocument();
    expect(getByTestId(TURNING_AUDIO)).toBeInTheDocument();
    expect(getByTestId(MUTE_BUTTON)).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should initially be muted', () => {
    render(<Sound playCatSound={true} />);
    expect(playCat).not.toHaveBeenCalled();
  });

  it('should play sounds after unmute button click', () => {
    const { getByTestId, rerender } = render(<Sound playCatSound={true} />);
    expect(playCat).not.toHaveBeenCalled();

    fireEvent.click(getByTestId(MUTE_BUTTON));

    rerender(<Sound playCatSound={true} />);
    expect(playCat).toHaveBeenCalled();
  });

  it('should not play sounds after mute button click', () => {
    const { getByTestId, rerender } = render(<Sound playCatSound={true} />);
    fireEvent.click(getByTestId(MUTE_BUTTON));

    rerender(<Sound playCatSound={true} />);
    expect(playCat).toHaveBeenCalled();

    playCat.mockClear();
    fireEvent.click(getByTestId(MUTE_BUTTON));

    rerender(<Sound playCatSound={true} />);
    expect(playCat).not.toHaveBeenCalled();
  });

  it('should play turning sound when unmuted', () => {
    const { getByTestId } = render(<Sound />);

    expect(playTurning).not.toHaveBeenCalled();

    fireEvent.click(getByTestId(MUTE_BUTTON));
    expect(playTurning).toHaveBeenCalled();

    playTurning.mockClear();

    fireEvent.click(getByTestId(MUTE_BUTTON));
    expect(playTurning).not.toHaveBeenCalled();

    fireEvent.click(getByTestId(MUTE_BUTTON));
    expect(playTurning).toHaveBeenCalled();
  });

  it('should play cat sound', () => {
    const { getByTestId, rerender } = render(<Sound playCatSound={true} />);
    fireEvent.click(getByTestId(MUTE_BUTTON));

    rerender(<Sound playCatSound={true} />);
    expect(playCat).toHaveBeenCalled();
  });

  it('should play turning sound', () => {
    const { getByTestId, rerender } = render(<Sound playTurningSound={true} />);
    fireEvent.click(getByTestId(MUTE_BUTTON));

    rerender(<Sound playTurningSound={true} />);
    expect(playTurning).toHaveBeenCalled();
  });
});
