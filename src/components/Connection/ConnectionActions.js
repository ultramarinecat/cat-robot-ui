//
// Connection actions
//

import { push } from 'connected-react-router';
import { AUTH, CAT } from '../Router/Router';

export const AUTH_SUCCESSFUL = 'AUTH_SUCCESSFUL';
export const AUTH_FAILED = 'AUTH_FAILED';
export const AUTH_FORBIDDEN = 'AUTH_FORBIDDEN';

export const CONNECTION_SUCCESSFUL = 'CONNECTION_SUCCESSFUL';
export const CONNECTION_TIMED_OUT = 'CONNECTION_TIMED_OUT';
export const CONNECTION_CONFLICT = 'CONNECTION_CONFLICT';

export const ROBOT_TURNING_RIGHT = 'ROBOT_TURNING_RIGHT';
export const ROBOT_TURNING_LEFT = 'ROBOT_TURNING_LEFT';
export const ROBOT_COMPLETED_TURN = 'ROBOT_COMPLETED_TURN';
export const ROBOT_CURRENTLY_TURNING = 'ROBOT_CURRENTLY_TURNING';

export const CAT_DETECTED = 'CAT_DETECTED';
export const CLEAR_CAT_DETECTED = 'CLEAR_CAT_DETECTED';
export const DISCONNECTED = 'DISCONNECTED';

const CONNECTED_TRANSITION_DELAY = 1000;
// const DISCONNECTED_TRANSITION_DELAY = 2000;
const DISCONNECTED_TRANSITION_DELAY = 4550;
const CLEAR_CAT_DETECTED_DELAY = 10000;

export function authSuccessful() {
  return {
    type: AUTH_SUCCESSFUL
  };
}

export function authFailed() {
  return {
    type: AUTH_FAILED
  };
}

export function authForbidden() {
  return {
    type: AUTH_FORBIDDEN
  };
}

export function connectionSuccessful() {
  return {
    type: CONNECTION_SUCCESSFUL
  };
}

export function connectionTimedOut() {
  return {
    type: CONNECTION_TIMED_OUT
  };
}

export function connectionConflict() {
  return {
    type: CONNECTION_CONFLICT
  };
}

export function robotTurningRight() {
  return {
    type: ROBOT_TURNING_RIGHT
  };
}

export function robotTurningLeft() {
  return {
    type: ROBOT_TURNING_LEFT
  };
}

export function robotCompletedTurn() {
  return {
    type: ROBOT_COMPLETED_TURN
  };
}

export function robotCurrentlyTurning() {
  return {
    type: ROBOT_CURRENTLY_TURNING
  };
}

export function disconnected() {
  return {
    type: DISCONNECTED
  };
}

export function catDetected() {
  return {
    type: CAT_DETECTED
  };
}

export function clearCatDetected() {
  return {
    type: CLEAR_CAT_DETECTED
  };
}

export function connectionSuccessfulAsync() {
  return dispatch => {
    dispatch(connectionSuccessful());

    setTimeout(() => {
      dispatch(push(CAT));
    }, CONNECTED_TRANSITION_DELAY);
  };
}

export function authFailedAsync(isReconnect) {
  return dispatch => {
    dispatch(authFailed());

    if (isReconnect) {
      dispatch(disconnectedAsync());
    }
  };
}

export function authForbiddenAsync(isReconnect) {
  return dispatch => {
    dispatch(authForbidden());

    if (isReconnect) {
      dispatch(disconnectedAsync());
    }
  };
}

export function disconnectedAsync() {
  return dispatch => {
    dispatch(disconnected());

    setTimeout(() => {
      dispatch(push(AUTH));
    }, DISCONNECTED_TRANSITION_DELAY);
  };
}

export function catDetectedAsync() {
  return dispatch => {
    dispatch(catDetected());

    setTimeout(() => {
      dispatch(clearCatDetected());
    }, CLEAR_CAT_DETECTED_DELAY);
  };
}
