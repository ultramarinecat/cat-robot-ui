import React from 'react';
import { render } from 'react-testing-library';

import { Particles } from '../Particles.js';

const PARTICLES = 'particles';

describe('Particles', () => {
  beforeAll(() => {
    window.particlesJS = jest.fn();
  });

  it('should display particles effect', () => {
    const { container, getByTestId } = render(<Particles />);

    expect(getByTestId(PARTICLES)).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
