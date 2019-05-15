//
// Cat reducer
//

import {
  CAT_DETECTED,
  ROBOT_CURRENTLY_TURNING,
  ROBOT_TURNING_LEFT,
  ROBOT_TURNING_RIGHT,
  ROBOT_COMPLETED_TURN,
  CONNECTION_SUCCESSFUL,
  CLEAR_CAT_DETECTED,
  DISCONNECTED
} from '../Connection/ConnectionActions.js';

export default function connectionReducer(state = {}, action) {
  switch (action.type) {
    case ROBOT_CURRENTLY_TURNING:
      return {
        ...state,
        ...{
          robotCurrentlyTurning: true,
          robotTurningLeft: false,
          robotTurningRight: false,
          robotCompletedTurn: false,
          catDetected: false
        }
      };
    case ROBOT_TURNING_LEFT:
      return {
        ...state,
        ...{
          robotTurningLeft: true,
          robotTurningRight: false,
          robotCompletedTurn: false,
          robotCurrentlyTurning: false,
          catDetected: false
        }
      };
    case ROBOT_TURNING_RIGHT:
      return {
        ...state,
        ...{
          robotTurningRight: true,
          robotTurningLeft: false,
          robotCompletedTurn: false,
          robotCurrentlyTurning: false,
          catDetected: false
        }
      };
    case ROBOT_COMPLETED_TURN:
      return {
        ...state,
        ...{
          robotCompletedTurn: true,
          robotTurningLeft: false,
          robotTurningRight: false,
          robotCurrentlyTurning: false,
          catDetected: false
        }
      };
    case CAT_DETECTED:
      return {
        ...state,
        ...{
          catDetected: true,
          robotTurningLeft: false,
          robotTurningRight: false,
          robotCompletedTurn: false,
          robotCurrentlyTurning: false
        }
      };
    case CLEAR_CAT_DETECTED:
      return {
        ...state,
        ...{
          catDetected: false
        }
      };
    case CONNECTION_SUCCESSFUL:
      return {
        ...state,
        ...{
          disconnected: false
        }
      };
    case DISCONNECTED:
      return {
        ...state,
        ...{
          disconnected: true
        }
      };
    default:
      return state;
  }
}
