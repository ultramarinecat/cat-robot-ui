import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { introContinueAsync, INTRO_CONTINUE } from '../IntroActions.js';

jest.mock('connected-react-router', () => ({
  push: path => ({ type: 'PUSH', payload: path })
}));

jest.mock('../../Router/Router', () => ({
  AUTH: '/auth/'
}));

let store;

describe('IntroActions', () => {
  describe('introContinueAsync', () => {
    beforeAll(() => {
      const mockStore = configureStore([thunk]);
      store = mockStore({});
    });

    it('should dispatch intro continue action and push auth path', () => {
      store.dispatch(introContinueAsync());

      const expectedActions = [
        { type: INTRO_CONTINUE },
        { type: 'PUSH', payload: '/auth/' }
      ];

      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
