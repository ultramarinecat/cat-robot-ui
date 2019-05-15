import AuthReducer from '../AuthReducer.js';
import { connectToRobot } from '../AuthActions.js';

import {
  authSuccessful,
  authFailed,
  authForbidden,
  connectionSuccessful,
  connectionTimedOut,
  connectionConflict
} from '../../Connection/ConnectionActions.js';

jest.mock('../../Connection/ConnectionActions', () => ({
  AUTH_SUCCESSFUL: 'AUTH_SUCCESSFUL',
  AUTH_FAILED: 'AUTH_FAILED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  CONNECTION_SUCCESSFUL: 'CONNECTION_SUCCESSFUL',
  CONNECTION_TIMED_OUT: 'CONNECTION_TIMED_OUT',
  CONNECTION_CONFLICT: 'CONNECTION_CONFLICT',

  authSuccessful: () => ({ type: 'AUTH_SUCCESSFUL' }),
  authFailed: () => ({ type: 'AUTH_FAILED' }),
  authForbidden: () => ({ type: 'AUTH_FORBIDDEN' }),
  connectionSuccessful: () => ({ type: 'CONNECTION_SUCCESSFUL' }),
  connectionTimedOut: () => ({ type: 'CONNECTION_TIMED_OUT' }),
  connectionConflict: () => ({ type: 'CONNECTION_CONFLICT' })
}));

const state = {
  cat: 'meow'
};

describe('AuthReducer', () => {
  it(`should update connecting to true and connectionTimedOut, connectionConflict, and
      authFailed to false in the state on a connect action`, () => {
    const initialState = {
      ...state,
      connecting: false,
      connectionTimedOut: true,
      connectionConflict: true,
      authFailed: true
    };

    const expectedState = {
      ...state,
      connecting: true,
      connectionTimedOut: false,
      connectionConflict: false,
      authFailed: false
    };

    expect(AuthReducer(initialState, connectToRobot('dog'))).toEqual(expectedState);
  });

  it(`should update authFailed and connecting to false in the state on an auth successful
      action`, () => {
    const initialState = {
      ...state,
      authFailed: true,
      connecting: true
    };

    const expectedState = {
      ...state,
      authFailed: false,
      connecting: false
    };

    expect(AuthReducer(initialState, authSuccessful())).toEqual(expectedState);
  });

  it(`should update authFailed to true connecting to false in the state on an auth failed
      action`, () => {
    const initialState = {
      ...state,
      authFailed: false,
      connecting: true
    };

    const expectedState = {
      ...state,
      authFailed: true,
      connecting: false
    };

    expect(AuthReducer(initialState, authFailed())).toEqual(expectedState);
  });

  it(`should update authFailed to true connecting to false in the state on an auth forbidden
      action`, () => {
    const initialState = {
      ...state,
      authFailed: false,
      connecting: true
    };

    const expectedState = {
      ...state,
      authFailed: true,
      connecting: false
    };

    expect(AuthReducer(initialState, authForbidden())).toEqual(expectedState);
  });

  it(`should update connectionTimedOut to false and connecting to false in the state on
      a connection successful action`, () => {
    const initialState = {
      ...state,
      connectionTimedOut: true,
      connecting: true
    };

    const expectedState = {
      ...state,
      connectionTimedOut: false,
      connecting: false
    };

    expect(AuthReducer(initialState, connectionSuccessful())).toEqual(expectedState);
  });

  it(`should update connectionTimedOut to true and connecting to false in the state on
     a connection timed out action`, () => {
    const initialState = {
      ...state,
      connectionTimedOut: false,
      connecting: true
    };

    const expectedState = {
      ...state,
      connectionTimedOut: true,
      connecting: false
    };

    expect(AuthReducer(initialState, connectionTimedOut())).toEqual(expectedState);
  });

  it(`should update connectionConflict to true and connecting to false in the state on
      a connection conflict action`, () => {
    const initialState = {
      ...state,
      connectionConflict: false,
      connecting: true
    };

    const expectedState = {
      ...state,
      connectionConflict: true,
      connecting: false
    };

    expect(AuthReducer(initialState, connectionConflict())).toEqual(expectedState);
  });
});
