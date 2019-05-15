//
// Auth actions
//

export const CONNECT = 'CONNECT';

export function connectToRobot(catKey) {
  return {
    type: CONNECT,
    payload: catKey
  };
}
