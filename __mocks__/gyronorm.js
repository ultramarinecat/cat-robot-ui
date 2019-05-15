let startCallback;

const gyro = {
  init: jest.fn(() => Promise.resolve()),
  start: jest.fn(callback => {
    startCallback = callback;
  }),
  isRunning: jest.fn(() => true),
  end: jest.fn(),
  setTiltAngle: angle => {
    startCallback({
      do: {
        gamma: angle
      }
    });
  }
};

function GyroNorm() {
  return gyro;
}

module.exports = GyroNorm;
