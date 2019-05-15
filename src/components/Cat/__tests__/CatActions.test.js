import { leftTilt, rightTilt, LEFT_TILT, RIGHT_TILT } from '../CatActions.js';

describe('CatActions', () => {
  describe('leftTilt', () => {
    it('should return left tilt action', () => {
      const expectedAction = {
        type: LEFT_TILT
      };

      expect(leftTilt()).toEqual(expectedAction);
    });
  });

  describe('rightTilt', () => {
    it('should return right tilt action', () => {
      const expectedAction = {
        type: RIGHT_TILT
      };

      expect(rightTilt()).toEqual(expectedAction);
    });
  });
});
