import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import { Mute } from '../Mute.js';

const MUTE = 'mute';
const MUTE_ICON = 'mute-icon';
const UNMUTE_ICON = 'unmute-icon';

describe('Mute', () => {
  it('should display unmute icon if `isMuted` is true', () => {
    const { getByTestId, queryByTestId, container } = render(
      <Mute isMuted={true} onClick={jest.fn()} />
    );

    const mute = getByTestId(MUTE);
    const muteIcon = queryByTestId(MUTE_ICON);
    const unmuteIcon = queryByTestId(UNMUTE_ICON);

    expect(mute).toBeInTheDocument();
    expect(unmuteIcon).toBeInTheDocument();
    expect(muteIcon).toBeNull();

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should display mute icon if `isMuted` is false', () => {
    const { getByTestId, queryByTestId, container } = render(
      <Mute isMuted={false} onClick={jest.fn()} />
    );

    const mute = getByTestId(MUTE);
    const muteIcon = queryByTestId(MUTE_ICON);
    const unmuteIcon = queryByTestId(UNMUTE_ICON);

    expect(mute).toBeInTheDocument();
    expect(muteIcon).toBeInTheDocument();
    expect(unmuteIcon).toBeNull();

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call callback prop when clicked', () => {
    const handleClick = jest.fn();

    const { getByTestId } = render(<Mute isMuted={true} onClick={handleClick} />);

    const mute = getByTestId(MUTE);
    fireEvent.click(mute);

    expect(handleClick).toHaveBeenCalled();
  });
});
