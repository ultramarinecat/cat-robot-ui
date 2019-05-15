import React from 'react';
import { render } from 'react-testing-library';

import { ErrorBoundary } from '../ErrorBoundary.js';

const FALLBACK_UI = 'error-fallback-ui';
const CAT = 'cat';
const DOG = 'dog';

let consoleError;

const Cat = () => <div>{CAT}</div>;
const Dog = () => {
  throw new Error('dog!');
  return <div>{DOG}</div>; // eslint-disable-line no-unreachable
};

describe('ErrorBoundary', () => {
  beforeAll(() => {
    consoleError = console.error;
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = consoleError;
  });

  it('should render children when an error is not thrown by a descendant component', () => {
    const { container, queryByText, queryByTestId } = render(
      <ErrorBoundary t={key => key}>
        <Cat />
      </ErrorBoundary>
    );

    expect(queryByText(CAT)).toBeInTheDocument();
    expect(queryByTestId(FALLBACK_UI)).toBeNull();

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should display fallback ui when an error is thrown by a descendant component', () => {
    const { container, queryByText, queryByTestId } = render(
      <ErrorBoundary t={key => key}>
        <Dog />
      </ErrorBoundary>
    );

    expect(queryByTestId(FALLBACK_UI)).toBeInTheDocument();
    expect(queryByText(DOG)).toBeNull();

    expect(container.firstChild).toMatchSnapshot();
  });
});
