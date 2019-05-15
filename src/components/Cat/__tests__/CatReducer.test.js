import CatReducer from '../CatReducer.js';

import {
  catDetected,
  robotCurrentlyTurning,
  robotTurningLeft,
  robotTurningRight,
  robotCompletedTurn,
  connectionSuccessful,
  clearCatDetected,
  disconnected
} from '../../Connection/ConnectionActions.js';

jest.mock('../../Connection/ConnectionActions', () => ({
  CAT_DETECTED: 'CAT_DETECTED',
  ROBOT_CURRENTLY_TURNING: 'ROBOT_CURRENTLY_TURNING',
  ROBOT_TURNING_LEFT: 'ROBOT_TURNING_LEFT',
  ROBOT_TURNING_RIGHT: 'ROBOT_TURNING_RIGHT',
  ROBOT_COMPLETED_TURN: 'ROBOT_COMPLETED_TURN',
  CONNECTION_SUCCESSFUL: 'CONNECTION_SUCCESSFUL',
  CLEAR_CAT_DETECTED: 'CLEAR_CAT_DETECTED',
  DISCONNECTED: 'DISCONNECTED',

  catDetected: () => ({ type: 'CAT_DETECTED' }),
  robotCurrentlyTurning: () => ({ type: 'ROBOT_CURRENTLY_TURNING' }),
  robotTurningLeft: () => ({ type: 'ROBOT_TURNING_LEFT' }),
  robotTurningRight: () => ({ type: 'ROBOT_TURNING_RIGHT' }),
  robotCompletedTurn: () => ({ type: 'ROBOT_COMPLETED_TURN' }),
  connectionSuccessful: () => ({ type: 'CONNECTION_SUCCESSFUL' }),
  clearCatDetected: () => ({ type: 'CLEAR_CAT_DETECTED' }),
  disconnected: () => ({ type: 'DISCONNECTED' })
}));

const state = {
  cat: 'meow'
};

describe('CatReducer', () => {
  it(`should update robotCurrentlyTurning to true and robotTurningLeft, robotTurningRight,
      robotCompletedTurn, and catDetected to false in the state on a robot currently turning action`, () => {
    const initialState = {
      ...state,
      robotCurrentlyTurning: false,
      robotTurningLeft: true,
      robotTurningRight: true,
      robotCompletedTurn: true,
      catDetected: true
    };

    const expectedState = {
      ...state,
      robotCurrentlyTurning: true,
      robotTurningLeft: false,
      robotTurningRight: false,
      robotCompletedTurn: false,
      catDetected: false
    };

    expect(CatReducer(initialState, robotCurrentlyTurning())).toEqual(expectedState);
  });

  it(`should update robotTurningLeft to true and robotTurningRight, robotCompletedTurn,
      robotCurrentlyTurning, and catDetected to false in the state on a robot turning left action`, () => {
    const initialState = {
      ...state,
      robotTurningLeft: false,
      robotTurningRight: true,
      robotCompletedTurn: true,
      robotCurrentlyTurning: true,
      catDetected: true
    };

    const expectedState = {
      ...state,
      robotTurningLeft: true,
      robotTurningRight: false,
      robotCompletedTurn: false,
      robotCurrentlyTurning: false,
      catDetected: false
    };

    expect(CatReducer(initialState, robotTurningLeft())).toEqual(expectedState);
  });

  it(`should update robotTurningRight to true and robotTurningLeft, robotCompletedTurn,
      robotCurrentlyTurning, and catDetected to false in the state on a robot turning right action`, () => {
    const initialState = {
      ...state,
      robotTurningRight: false,
      robotTurningLeft: true,
      robotCompletedTurn: true,
      robotCurrentlyTurning: true,
      catDetected: true
    };

    const expectedState = {
      ...state,
      robotTurningRight: true,
      robotTurningLeft: false,
      robotCompletedTurn: false,
      robotCurrentlyTurning: false,
      catDetected: false
    };

    expect(CatReducer(initialState, robotTurningRight())).toEqual(expectedState);
  });

  it(`should update robotCompletedTurn to true and robotTurningLeft, robotTurningRight,
      robotCurrentlyTurning, and robotCurrentlyTurning to false in the state on a
      robot completed turn action`, () => {
    const initialState = {
      ...state,
      robotCompletedTurn: false,
      robotTurningLeft: true,
      robotTurningRight: true,
      robotCurrentlyTurning: true,
      catDetected: true
    };

    const expectedState = {
      ...state,
      robotCompletedTurn: true,
      robotTurningLeft: false,
      robotTurningRight: false,
      robotCurrentlyTurning: false,
      catDetected: false
    };

    expect(CatReducer(initialState, robotCompletedTurn())).toEqual(expectedState);
  });

  it(`should update catDetected to true and robotTurningLeft, robotTurningRight,
      robotCompletedTurn, and robotCurrentlyTurning to false in the state on a cat detected action`, () => {
    const initialState = {
      ...state,
      catDetected: false,
      robotTurningLeft: true,
      robotTurningRight: true,
      robotCompletedTurn: true,
      robotCurrentlyTurning: true
    };

    const expectedState = {
      ...state,
      catDetected: true,
      robotTurningLeft: false,
      robotTurningRight: false,
      robotCompletedTurn: false,
      robotCurrentlyTurning: false
    };

    expect(CatReducer(initialState, catDetected())).toEqual(expectedState);
  });

  it('should update catDetected to false in the state on a clear cat detected action', () => {
    const initialState = {
      ...state,
      catDetected: true
    };

    const expectedState = {
      ...state,
      catDetected: false
    };

    expect(CatReducer(initialState, clearCatDetected())).toEqual(expectedState);
  });

  it('should update disconnected to false in the state on a connection successful action', () => {
    const initialState = {
      ...state,
      disconnected: true
    };

    const expectedState = {
      ...state,
      disconnected: false
    };

    expect(CatReducer(initialState, connectionSuccessful())).toEqual(expectedState);
  });

  it('should update disconnected to true in the state on a disconnected action', () => {
    const initialState = {
      ...state,
      disconnected: false
    };

    const expectedState = {
      ...state,
      disconnected: true
    };

    expect(CatReducer(initialState, disconnected())).toEqual(expectedState);
  });
});
