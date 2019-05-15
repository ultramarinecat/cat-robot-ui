//
// Cat actions
//

export const LEFT_TILT = 'LEFT_TILT';
export const RIGHT_TILT = 'RIGHT_TILT';

export function leftTilt() {
  return {
    type: LEFT_TILT
  };
}

export function rightTilt() {
  return {
    type: RIGHT_TILT
  };
}
