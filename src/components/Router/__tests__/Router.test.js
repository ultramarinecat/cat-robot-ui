import React from 'react';

import { render } from 'react-testing-library';
import { MemoryRouter as MockMemoryRouter, withRouter } from 'react-router';

import { Router, AUTH as AUTH_LOCATION, CAT as CAT_LOCATION } from '../Router.js';

const INTRO = 'intro';
const AUTH = 'auth';
const CAT = 'cat';
const CONNECTION = 'connection';
const UNMATCHED_LOCATION = '/dog/';

let history;

const MockRoute = withRouter(props => {
  history = props.history;
  return null;
});

jest.mock('connected-react-router', () => ({
  ConnectedRouter: ({ children }) => (
    <MockMemoryRouter>
      <>
        <MockRoute />
        {children}
      </>
    </MockMemoryRouter>
  )
}));

jest.mock('react-transition-group', () => ({
  TransitionGroup: ({ children }) => children,
  CSSTransition: ({ children }) => children
}));

jest.mock('../../../configureStore', () => ({
  history: {}
}));

jest.mock('../../Connection/Connection', () => () => <div data-testid="connection" />);

jest.mock('../../Intro/Intro', () => () => <div data-testid="intro" />);

jest.mock('../../Auth/Auth', () => () => <div data-testid="auth" />);

jest.mock('../../Cat/Cat', () => () => <div data-testid="cat" />);

describe('Router', () => {
  it('should render the intro component when location is `/', () => {
    const { queryByTestId } = render(<Router />);

    expect(queryByTestId(INTRO)).toBeInTheDocument();

    expect(queryByTestId(AUTH)).toBeNull();
    expect(queryByTestId(CAT)).toBeNull();
  });

  it('should render the auth component when location is `/auth`', () => {
    const { queryByTestId } = render(<Router />);

    history.push(AUTH_LOCATION);

    expect(queryByTestId(AUTH)).toBeInTheDocument();

    expect(queryByTestId(INTRO)).toBeNull();
    expect(queryByTestId(CAT)).toBeNull();
  });

  it('should render the cat component when location is `/cat`', () => {
    const { queryByTestId } = render(<Router />);

    history.push(CAT_LOCATION);

    expect(queryByTestId(CAT)).toBeInTheDocument();

    expect(queryByTestId(INTRO)).toBeNull();
    expect(queryByTestId(AUTH)).toBeNull();
  });

  it('should render the intro component when location is not matched', () => {
    const { queryByTestId } = render(<Router />);
    history.push(UNMATCHED_LOCATION);

    expect(queryByTestId(INTRO)).toBeInTheDocument();

    expect(queryByTestId(AUTH)).toBeNull();
    expect(queryByTestId(CAT)).toBeNull();
  });

  it('should render the connection component when location is `/auth` or `/cat`', () => {
    const { queryByTestId } = render(<Router />);
    expect(queryByTestId(CONNECTION)).toBeNull();

    history.push(UNMATCHED_LOCATION);
    expect(queryByTestId(CONNECTION)).toBeNull();

    history.push(AUTH_LOCATION);
    expect(queryByTestId(CONNECTION)).toBeInTheDocument();

    history.push(CAT_LOCATION);
    expect(queryByTestId(CONNECTION)).toBeInTheDocument();
  });
});
