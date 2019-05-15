import React from 'react';
import { render } from 'react-testing-library';

import { Pulse } from '../Pulse.js';

const PULSE = 'pulse';

describe('Pulse', () => {
  it('should display a pulse animation', () => {
    const { container, getByTestId } = render(<Pulse />);

    expect(getByTestId(PULSE)).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
