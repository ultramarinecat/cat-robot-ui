//
// Connection reducer
//

import { CONNECT } from '../Auth/AuthActions.js';

import {
  AUTH_FAILED,
  AUTH_FORBIDDEN,
  CONNECTION_TIMED_OUT,
  CONNECTION_CONFLICT
} from './ConnectionActions.js';

import { LEFT_TILT, RIGHT_TILT } from '../Cat/CatActions.js';

export default function connectionReducer(state = {}, action) {
  switch (action.type) {
    case CONNECT:
      return {
        ...state,
        ...{
          catKey: action.payload
        }
      };
    case AUTH_FAILED:
    case AUTH_FORBIDDEN:
    case CONNECTION_TIMED_OUT:
    case CONNECTION_CONFLICT:
      return {
        ...state,
        ...{
          connected: false,
          catKey: null
        }
      };
    case LEFT_TILT:
      return {
        ...state,
        ...{
          turnLeft: true,
          turnRight: false,
          updateTurn: !state.updateTurn // update even if turn direction hasn't changed
        }
      };
    case RIGHT_TILT:
      return {
        ...state,
        ...{
          turnLeft: false,
          turnRight: true,
          updateTurn: !state.updateTurn
        }
      };
    default:
      return state;
  }
}
