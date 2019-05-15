import { connectToRobot, CONNECT } from '../AuthActions.js';

describe('AuthActions', () => {
  describe('connectToRobot', () => {
    it('should return connect action with cat key payload', () => {
      const catKey = 'cat';
      const expectedAction = {
        type: CONNECT,
        payload: catKey
      };

      expect(connectToRobot(catKey)).toEqual(expectedAction);
    });
  });
});
