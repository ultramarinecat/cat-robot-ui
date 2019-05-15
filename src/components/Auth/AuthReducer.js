//
// Auth reducer
//

import {
  AUTH_SUCCESSFUL,
  AUTH_FAILED,
  AUTH_FORBIDDEN,
  CONNECTION_SUCCESSFUL,
  CONNECTION_TIMED_OUT,
  CONNECTION_CONFLICT
} from '../Connection/ConnectionActions.js';

import { CONNECT } from './AuthActions.js';

export default function authReducer(state = {}, action) {
  switch (action.type) {
    case CONNECT:
      return {
        ...state,
        ...{
          connecting: true,
          connectionTimedOut: false,
          connectionConflict: false,
          authFailed: false
        }
      };
    case AUTH_SUCCESSFUL:
      return {
        ...state,
        ...{
          authFailed: false,
          connecting: false
        }
      };
    case AUTH_FAILED:
      return {
        ...state,
        ...{
          authFailed: true,
          connecting: false
        }
      };
    case AUTH_FORBIDDEN:
      return {
        ...state,
        ...{
          authFailed: true,
          connecting: false
        }
      };
    case CONNECTION_SUCCESSFUL:
      return {
        ...state,
        ...{
          connectionTimedOut: false,
          connecting: false
        }
      };
    case CONNECTION_TIMED_OUT:
      return {
        ...state,
        ...{
          connectionTimedOut: true,
          connecting: false
        }
      };
    case CONNECTION_CONFLICT:
      return {
        ...state,
        ...{
          connectionConflict: true,
          connecting: false
        }
      };
    default:
      return state;
  }
}
