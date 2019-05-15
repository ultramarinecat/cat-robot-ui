import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  authSuccessful,
  authFailed,
  authForbidden,
  connectionSuccessful,
  connectionTimedOut,
  connectionConflict,
  robotTurningRight,
  robotTurningLeft,
  robotCompletedTurn,
  robotCurrentlyTurning,
  disconnected,
  catDetected,
  clearCatDetected,
  connectionSuccessfulAsync,
  authFailedAsync,
  authForbiddenAsync,
  disconnectedAsync,
  catDetectedAsync,
  AUTH_SUCCESSFUL,
  AUTH_FAILED,
  AUTH_FORBIDDEN,
  CONNECTION_SUCCESSFUL,
  CONNECTION_TIMED_OUT,
  CONNECTION_CONFLICT,
  ROBOT_TURNING_RIGHT,
  ROBOT_TURNING_LEFT,
  ROBOT_COMPLETED_TURN,
  ROBOT_CURRENTLY_TURNING,
  DISCONNECTED,
  CAT_DETECTED,
  CLEAR_CAT_DETECTED
} from '../ConnectionActions.js';

jest.mock('connected-react-router', () => ({
  push: path => ({ type: 'PUSH', payload: path })
}));

jest.mock('../../Router/Router', () => ({
  AUTH: '/auth/',
  CAT: '/cat/'
}));

const PUSH = 'PUSH';
const AUTH = '/auth/';
const CAT = '/cat/';

let store;

describe('ConnectionActions', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  describe('authSuccessful', () => {
    it('should return auth successful action', () => {
      const expectedAction = {
        type: AUTH_SUCCESSFUL
      };

      expect(authSuccessful()).toEqual(expectedAction);
    });
  });

  describe('authFailed', () => {
    it('should return auth failed action', () => {
      const expectedAction = {
        type: AUTH_FAILED
      };

      expect(authFailed()).toEqual(expectedAction);
    });
  });

  describe('authForbidden', () => {
    it('should return auth forbidden action', () => {
      const expectedAction = {
        type: AUTH_FORBIDDEN
      };

      expect(authForbidden()).toEqual(expectedAction);
    });
  });

  describe('connectionSuccessful', () => {
    it('should return connection successful action', () => {
      const expectedAction = {
        type: CONNECTION_SUCCESSFUL
      };

      expect(connectionSuccessful()).toEqual(expectedAction);
    });
  });

  describe('connectionTimedOut', () => {
    it('should return connection timed out action', () => {
      const expectedAction = {
        type: CONNECTION_TIMED_OUT
      };

      expect(connectionTimedOut()).toEqual(expectedAction);
    });
  });

  describe('connectionConflict', () => {
    it('should return connection conflict action', () => {
      const expectedAction = {
        type: CONNECTION_CONFLICT
      };

      expect(connectionConflict()).toEqual(expectedAction);
    });
  });

  describe('robotTurningRight', () => {
    it('should return robot turning right action', () => {
      const expectedAction = {
        type: ROBOT_TURNING_RIGHT
      };

      expect(robotTurningRight()).toEqual(expectedAction);
    });
  });

  describe('robotTurningLeft', () => {
    it('should return robot turning left action', () => {
      const expectedAction = {
        type: ROBOT_TURNING_LEFT
      };

      expect(robotTurningLeft()).toEqual(expectedAction);
    });
  });

  describe('robotCompletedTurn', () => {
    it('should return completed turn action', () => {
      const expectedAction = {
        type: ROBOT_COMPLETED_TURN
      };

      expect(robotCompletedTurn()).toEqual(expectedAction);
    });
  });

  describe('robotCurrentlyTurning', () => {
    it('should return robot currently turning action', () => {
      const expectedAction = {
        type: ROBOT_CURRENTLY_TURNING
      };

      expect(robotCurrentlyTurning()).toEqual(expectedAction);
    });
  });

  describe('disconnected', () => {
    it('should return disconnected action', () => {
      const expectedAction = {
        type: DISCONNECTED
      };

      expect(disconnected()).toEqual(expectedAction);
    });
  });

  describe('catDetected', () => {
    it('should return cat detected action', () => {
      const expectedAction = {
        type: CAT_DETECTED
      };

      expect(catDetected()).toEqual(expectedAction);
    });
  });

  describe('clearCatDetected', () => {
    it('should return clear cat detected action', () => {
      const expectedAction = {
        type: CLEAR_CAT_DETECTED
      };

      expect(clearCatDetected()).toEqual(expectedAction);
    });
  });

  describe('async actions', () => {
    beforeAll(() => {
      const mockStore = configureStore([thunk]);
      store = mockStore({});
    });

    afterEach(() => {
      store.clearActions();
    });

    describe('connectionSuccessfulAsync', () => {
      it('should dispatch connection successful action and push cat path', () => {
        store.dispatch(connectionSuccessfulAsync());
        jest.runAllTimers();

        const expectedActions = [
          { type: CONNECTION_SUCCESSFUL },
          { type: PUSH, payload: CAT }
        ];

        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('authFailedAsync', () => {
      it('should dispatch auth failed action and push auth path', () => {
        store.dispatch(authFailedAsync());
        jest.runAllTimers();

        const expectedActions = [{ type: AUTH_FAILED }];

        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should dispatch auth failed and disconnect actions and push auth path if reconnecting', () => {
        store.dispatch(authFailedAsync(true));
        jest.runAllTimers();

        const expectedActions = [
          { type: AUTH_FAILED },
          { type: DISCONNECTED },
          { type: PUSH, payload: AUTH }
        ];

        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('authForbiddenAsync', () => {
      it('should dispatch auth forbidden action and push auth path', () => {
        store.dispatch(authForbiddenAsync());
        jest.runAllTimers();

        const expectedActions = [{ type: AUTH_FORBIDDEN }];

        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should dispatch auth forbidden and disconnect actions and push auth path if reconnecting', () => {
        store.dispatch(authForbiddenAsync(true));
        jest.runAllTimers();

        const expectedActions = [
          { type: AUTH_FORBIDDEN },
          { type: DISCONNECTED },
          { type: PUSH, payload: AUTH }
        ];

        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('disconnectedAsync', () => {
      it('should dispatch disconnected action and push auth path', () => {
        store.dispatch(disconnectedAsync());
        jest.runAllTimers();

        const expectedActions = [{ type: DISCONNECTED }, { type: PUSH, payload: AUTH }];

        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('catDetected', () => {
      it('should dispatch cat detected and clear cat detected actions', () => {
        store.dispatch(catDetectedAsync());
        jest.runAllTimers();

        const expectedActions = [{ type: CAT_DETECTED }, { type: CLEAR_CAT_DETECTED }];

        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
