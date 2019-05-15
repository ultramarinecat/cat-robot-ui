import React from 'react';
import { render } from 'react-testing-library';

import { App } from '../App.js';

jest.mock('loglevel');
jest.mock('../i18n.js');
jest.mock('../../Particles/Particles');

jest.mock('../../Router/Router', () => () => <div data-testid="router" />);

describe('App', () => {
  it('should render the app router', () => {
    const { container, getByTestId } = render(<App t={key => key} />);

    expect(getByTestId('router')).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
