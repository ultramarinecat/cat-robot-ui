import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import { Intro } from '../Intro.js';

const CONTINUE = 'get_started';

describe('Intro', () => {
  it('should display a continue button', () => {
    const { container, getByText } = render(
      <Intro introContinue={jest.fn()} t={key => key} />
    );

    expect(getByText(CONTINUE)).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call `introContinue` prop when continue button is clicked', () => {
    const introContinue = jest.fn();
    const { getByText } = render(<Intro introContinue={introContinue} t={key => key} />);

    fireEvent.click(getByText(CONTINUE));
    expect(introContinue).toHaveBeenCalled();
  });
});
