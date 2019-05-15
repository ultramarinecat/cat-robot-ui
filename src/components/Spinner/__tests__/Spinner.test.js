import React from 'react';
import { render } from 'react-testing-library';

import { Spinner } from '../Spinner.js';

const SPINNER = 'spinner';
const HIDDEN_CLASS = 'invisible';

describe('Spinner', () => {
  it('should display a spinner', () => {
    const { container, getByTestId } = render(<Spinner />);
    const spinner = getByTestId(SPINNER);

    expect(spinner).toBeInTheDocument();
    expect(spinner).not.toHaveClass(HIDDEN_CLASS);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should not display a spinner when `spinning` is false', () => {
    const { container, getByTestId } = render(<Spinner spinning={false} />);
    const spinner = getByTestId(SPINNER);

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(HIDDEN_CLASS);

    expect(container.firstChild).toMatchSnapshot();
  });
});
