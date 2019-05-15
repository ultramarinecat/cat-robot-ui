import ConnectionReducer from '../ConnectionReducer.js';

import {
  authFailed,
  authForbidden,
  connectionTimedOut,
  connectionConflict
} from '../ConnectionActions.js';

import { connectToRobot } from '../../Auth/AuthActions.js';
import { leftTilt, rightTilt } from '../../Cat/CatActions.js';

jest.mock('../ConnectionActions', () => ({
  AUTH_FAILED: 'AUTH_FAILED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  CONNECTION_TIMED_OUT: 'CONNECTION_TIMED_OUT',
  CONNECTION_CONFLICT: 'CONNECTION_CONFLICT',

  authFailed: () => ({ type: 'AUTH_FAILED' }),
  authForbidden: () => ({ type: 'AUTH_FORBIDDEN' }),
  connectionTimedOut: () => ({ type: 'CONNECTION_TIMED_OUT' }),
  connectionConflict: () => ({ type: 'CONNECTION_CONFLICT' })
}));

const state = {
  cat: 'meow'
};

describe('ConnectionReducer', () => {
  it('should update cat key in the state on a connect action', () => {
    const initialState = {
      ...state,
      catKey: 'cat'
    };

    const expectedState = {
      ...state,
      catKey: 'dog'
    };

    expect(ConnectionReducer(initialState, connectToRobot('dog'))).toEqual(expectedState);
  });

  it('should update connected to false and catKey to null in the state on an auth failed action', () => {
    const initialState = {
      ...state,
      connected: true,
      catKey: 'cat'
    };

    const expectedState = {
      ...state,
      connected: false,
      catKey: null
    };

    expect(ConnectionReducer(initialState, authFailed())).toEqual(expectedState);
  });

  it('should update connected to false and catKey to null in the state on an auth forbidden action', () => {
    const initialState = {
      ...state,
      connected: true,
      catKey: 'cat'
    };

    const expectedState = {
      ...state,
      connected: false,
      catKey: null
    };

    expect(ConnectionReducer(initialState, authForbidden())).toEqual(expectedState);
  });

  it('should update connected to false and catKey to null in the state on a connection timed out action', () => {
    const initialState = {
      ...state,
      connected: true,
      catKey: 'cat'
    };

    const expectedState = {
      ...state,
      connected: false,
      catKey: null
    };

    expect(ConnectionReducer(initialState, connectionTimedOut())).toEqual(expectedState);
  });

  it('should update connected to false and catKey to null in the state on a connection conflict action', () => {
    const initialState = {
      ...state,
      connected: true,
      catKey: 'cat'
    };

    const expectedState = {
      ...state,
      connected: false,
      catKey: null
    };

    expect(ConnectionReducer(initialState, connectionConflict())).toEqual(expectedState);
  });

  it('should update turnLeft to true and right turn to false in the state on a left tilt action', () => {
    const initialState = {
      ...state,
      turnLeft: false,
      turnRight: true,
      updateTurn: false
    };

    const expectedState = {
      ...state,
      turnLeft: true,
      turnRight: false,
      updateTurn: true
    };

    expect(ConnectionReducer(initialState, leftTilt())).toEqual(expectedState);
  });

  it('should update turnRight to true and right turn to false in the state on a right tilt action', () => {
    const initialState = {
      ...state,
      turnLeft: false,
      turnRight: true,
      updateTurn: false
    };

    const expectedState = {
      ...state,
      turnRight: true,
      turnLeft: false,
      updateTurn: true
    };

    expect(ConnectionReducer(initialState, rightTilt())).toEqual(expectedState);
  });
});
