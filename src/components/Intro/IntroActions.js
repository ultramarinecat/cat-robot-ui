//
// Intro actions
//

import { push } from 'connected-react-router';

import { AUTH } from '../Router/Router.js';

export const INTRO_CONTINUE = 'INTRO_CONTINUE';

export function introContinueAsync() {
  return dispatch => {
    dispatch(introContinue());

    dispatch(push(AUTH));
  };
}

function introContinue() {
  return {
    type: INTRO_CONTINUE
  };
}
