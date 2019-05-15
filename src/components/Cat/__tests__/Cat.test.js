import React from 'react';
import { render, act, wait } from 'react-testing-library';
import { advanceBy, advanceTo, clear } from 'jest-date-mock';

import GyroNorm from 'gyronorm';
import { Cat, REGISTER_TILT_ANGLE, TURN_REQUEST_MIN_INTERVAL } from '../Cat.js';

const mockPlayCatSound = jest.fn();
const mockPlayTurningSound = jest.fn();

jest.mock('../../Sound/Sound', () => ({ playCatSound, playTurningSound }) => {
  if (playCatSound) {
    mockPlayCatSound();
  }

  if (playTurningSound) {
    mockPlayTurningSound();
  }

  return <div data-testid="sound" />;
});

jest.mock('../../Typing/Typing', () => ({ text }) => (
  <div data-testid="status">{text}</div>
));

jest.mock('../../Pulse/Pulse');
jest.mock('../fulltilt.js');
jest.mock('loglevel');

const CONNECTED = 'connected';
const DISCONNECTED = 'disconnected';
const CAT_DETECTED = 'cat_detected';
const CURRENTLY_TURNING = 'currently_turning';
const TURNING_LEFT = 'turning_left';
const TURNING_RIGHT = 'turning_right';
const TURN_COMPLETED = 'turn_completed';

const STATUS = 'status';
const SOUND = 'sound';

let gyronorm = new GyroNorm();

describe('Cat', () => {
  beforeAll(() => {
    gyronorm = new GyroNorm();
    advanceTo(0);
  });

  afterEach(() => {
    mockPlayCatSound.mockClear();
    mockPlayTurningSound.mockClear();
  });

  afterAll(() => {
    clear();
  });

  it('should display status text and sounds', async () => {
    const { container, getByTestId } = render(
      <Cat leftTilt={jest.fn()} rightTilt={jest.fn()} t={key => key} />
    );

    expect(getByTestId(STATUS)).toBeInTheDocument();
    expect(getByTestId(SOUND)).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call the `leftTilt` prop and play turning sound if device is tilted left', async () => {
    const leftTilt = jest.fn();

    render(<Cat leftTilt={leftTilt} rightTilt={jest.fn()} t={key => key} />);

    await wait(() => {
      expect(gyronorm.start).toHaveBeenCalled();
    });

    act(() => {
      gyronorm.setTiltAngle(0);
      gyronorm.setTiltAngle(-REGISTER_TILT_ANGLE);
    });

    expect(leftTilt).toHaveBeenCalled();
    expect(mockPlayTurningSound).toHaveBeenCalled();
  });

  it('should call the `rightTilt` prop and play turning sound if device is tilted right', async () => {
    const rightTilt = jest.fn();

    render(<Cat leftTilt={jest.fn()} rightTilt={rightTilt} t={key => key} />);

    await wait(() => {
      expect(gyronorm.start).toHaveBeenCalled();
    });

    advanceBy(TURN_REQUEST_MIN_INTERVAL);

    act(() => {
      gyronorm.setTiltAngle(0);
      gyronorm.setTiltAngle(REGISTER_TILT_ANGLE);
    });

    expect(rightTilt).toHaveBeenCalled();
    expect(mockPlayTurningSound).toHaveBeenCalled();
  });

  it(`should not register a tilt if device is tilted less than min angle required to register
      a tilt`, async () => {
    const leftTilt = jest.fn();
    const rightTilt = jest.fn();

    render(<Cat leftTilt={leftTilt} rightTilt={rightTilt} t={key => key} />);

    await wait(() => {
      expect(gyronorm.start).toHaveBeenCalled();
    });

    advanceBy(TURN_REQUEST_MIN_INTERVAL);

    act(() => {
      gyronorm.setTiltAngle(0);
      gyronorm.setTiltAngle(-(REGISTER_TILT_ANGLE - 1));
    });

    advanceBy(TURN_REQUEST_MIN_INTERVAL);

    act(() => {
      gyronorm.setTiltAngle(REGISTER_TILT_ANGLE - 1);
    });

    expect(leftTilt).not.toHaveBeenCalled();
    expect(rightTilt).not.toHaveBeenCalled();
  });

  it(`should not register a tilt if tilt hasn't been reset by tilting device to an angle
      less than min angle required to register tilt`, async () => {
    const rightTilt = jest.fn();
    render(<Cat leftTilt={jest.fn()} rightTilt={rightTilt} t={key => key} />);

    await wait(() => {
      expect(gyronorm.start).toHaveBeenCalled();
    });

    advanceBy(TURN_REQUEST_MIN_INTERVAL);
    act(() => {
      gyronorm.setTiltAngle(REGISTER_TILT_ANGLE + 1);
    });

    expect(rightTilt).toHaveBeenCalled();
    rightTilt.mockClear();

    advanceBy(TURN_REQUEST_MIN_INTERVAL);
    act(() => {
      gyronorm.setTiltAngle(REGISTER_TILT_ANGLE);
    });

    expect(rightTilt).not.toHaveBeenCalled();
    rightTilt.mockClear();

    act(() => {
      gyronorm.setTiltAngle(REGISTER_TILT_ANGLE - 1);
      gyronorm.setTiltAngle(REGISTER_TILT_ANGLE);
    });

    expect(rightTilt).toHaveBeenCalled();
  });

  it(`should not register a tilt if less than min interval has passsed since the previous
      tilt`, async () => {
    const rightTilt = jest.fn();
    render(<Cat leftTilt={jest.fn()} rightTilt={rightTilt} t={key => key} />);

    await wait(() => {
      expect(gyronorm.start).toHaveBeenCalled();
    });

    advanceBy(TURN_REQUEST_MIN_INTERVAL);
    act(() => {
      gyronorm.setTiltAngle(REGISTER_TILT_ANGLE - 1);
      gyronorm.setTiltAngle(REGISTER_TILT_ANGLE);
    });

    expect(rightTilt).toHaveBeenCalled();
    rightTilt.mockClear();

    advanceBy(TURN_REQUEST_MIN_INTERVAL - 1);
    act(() => {
      gyronorm.setTiltAngle(REGISTER_TILT_ANGLE - 1);
      gyronorm.setTiltAngle(REGISTER_TILT_ANGLE);
    });

    expect(rightTilt).not.toHaveBeenCalled();
    rightTilt.mockClear();

    advanceBy(1);
    act(() => {
      gyronorm.setTiltAngle(REGISTER_TILT_ANGLE - 1);
      gyronorm.setTiltAngle(REGISTER_TILT_ANGLE);
    });

    expect(rightTilt).toHaveBeenCalled();
  });

  it(`should initially display that it's connected`, () => {
    const { getByText } = render(
      <Cat leftTilt={jest.fn()} rightTilt={jest.fn()} t={key => key} />
    );

    expect(getByText(CONNECTED)).toBeInTheDocument();
  });

  it(`should display that it's disconnected if \`disconnected\` is true`, async () => {
    const { getByText } = render(
      <Cat
        disconnected={true}
        leftTilt={jest.fn()}
        rightTilt={jest.fn()}
        t={key => key}
      />
    );

    expect(getByText(DISCONNECTED)).toBeInTheDocument();
  });

  it('should display that cat is detected and play cat sound if `catDetected` is true', async () => {
    const { getByText } = render(
      <Cat catDetected={true} leftTilt={jest.fn()} rightTilt={jest.fn()} t={key => key} />
    );

    expect(getByText(CAT_DETECTED)).toBeInTheDocument();
    expect(mockPlayCatSound).toHaveBeenCalled();
  });

  it('should display that robot is currently turning if `robotCurrentlyTurning` is true', async () => {
    const { getByText } = render(
      <Cat
        robotCurrentlyTurning={true}
        leftTilt={jest.fn()}
        rightTilt={jest.fn()}
        t={key => key}
      />
    );

    expect(getByText(CURRENTLY_TURNING)).toBeInTheDocument();
  });

  it('should display that robot is turning left if `robotTurningLeft` is true', async () => {
    const { getByText } = render(
      <Cat
        robotTurningLeft={true}
        leftTilt={jest.fn()}
        rightTilt={jest.fn()}
        t={key => key}
      />
    );

    expect(getByText(TURNING_LEFT)).toBeInTheDocument();
  });

  it('should display that robot is turning right if `robotTurningRight` is true', async () => {
    const { getByText } = render(
      <Cat
        robotTurningRight={true}
        leftTilt={jest.fn()}
        rightTilt={jest.fn()}
        t={key => key}
      />
    );

    expect(getByText(TURNING_RIGHT)).toBeInTheDocument();
  });

  it('should display that robot completed turn if `robotCompletedTurn` is true', async () => {
    const { getByText } = render(
      <Cat
        robotCompletedTurn={true}
        leftTilt={jest.fn()}
        rightTilt={jest.fn()}
        t={key => key}
      />
    );

    expect(getByText(TURN_COMPLETED)).toBeInTheDocument();
  });
});
