import React from 'react';
import { render, wait } from 'react-testing-library';

import PubNub from 'pubnub';
import * as messages from '../messages.js';
import {
  Connection,
  MESSAGE_CHANNEL,
  CONNECTION_TIMEOUT_DELAY,
  HEARTBEAT_TIMEOUT_DELAY,
  HEARTBEAT_INTERVAL,
  CONNECTION_TOKEN,
  CONNECTION_ID
} from '../Connection.js';

jest.mock('../ConnectionActions', () => ({
  AUTH_SUCCESSFUL: 'AUTH_SUCCESSFUL',
  AUTH_FAILED: 'AUTH_FAILED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  CONNECTION_SUCCESSFUL: 'CONNECTION_SUCCESSFUL',
  CONNECTION_TIMED_OUT: 'CONNECTION_TIMED_OUT',
  CONNECTION_CONFLICT: 'CONNECTION_CONFLICT',
  ROBOT_TURNING_RIGHT: 'ROBOT_TURNING_RIGHT',
  ROBOT_TURNING_LEFT: 'ROBOT_TURNING_LEFT',
  ROBOT_COMPLETED_TURN: 'ROBOT_COMPLETED_TURN',
  ROBOT_CURRENTLY_TURNING: 'ROBOT_CURRENTLY_TURNING',
  DISCONNECTED: 'DISCONNECTED',
  CAT_DETECTED: 'CAT_DETECTED',

  authSuccessful: () => ({ type: 'AUTH_SUCCESSFUL' }),
  authFailed: () => ({ type: 'AUTH_FAILED' }),
  authForbidden: () => ({ type: 'AUTH_FORBIDDEN' }),
  connectionSuccessful: () => ({ type: 'CONNECTION_SUCCESSFUL' }),
  connectionTimedOut: () => ({ type: 'CONNECTION_TIMED_OUT' }),
  connectionConflict: () => ({ type: 'CONNECTION_CONFLICT' }),
  robotTurningRight: () => ({ type: 'ROBOT_TURNING_RIGHT' }),
  robotTurningLeft: () => ({ type: 'ROBOT_TURNING_LEFT' }),
  robotCompletedTurn: () => ({ type: 'ROBOT_COMPLETED_TURN' }),
  robotCurrentlyTurning: () => ({ type: 'ROBOT_CURRENTLY_TURNING' }),
  disconnected: () => ({ type: 'DISCONNECTED' }),
  catDetected: () => ({ type: 'CAT_DETECTED' })
}));

const mockConnectionId = '42';

jest.mock('uuid/v4', () => () => mockConnectionId);
jest.mock('loglevel');

let pubnub;

describe('Connection', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    pubnub = new PubNub();
  });

  afterEach(() => {
    pubnub.publish.mockClear();
    pubnub.setAuthFailed(false);
    pubnub.setAuthForbidden(false);

    sessionStorage.clear();
  });

  it(`should call \`authSuccessful\`, send a connection request, and store a connection id
      if there is a \`catKey\` and auth is successful`, async () => {
    const catKey = 'cat';
    const authSuccessful = jest.fn();

    render(
      <Connection
        catKey={catKey}
        authSuccessful={authSuccessful}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={jest.fn()}
        catDetected={jest.fn()}
      />
    );

    await wait(() => {
      expect(authSuccessful).toHaveBeenCalled();
    });

    expect(pubnub.publish).toHaveBeenCalledWith(
      {
        channel: MESSAGE_CHANNEL,
        message: {
          [messages.CONNECTION_REQUEST]: mockConnectionId
        }
      },
      expect.any(Function)
    );

    expect(sessionStorage.getItem(CONNECTION_ID)).toEqual(mockConnectionId);
  });

  it('should call `authForbidden` if there is a `catKey` and auth is invalid', async () => {
    const catKey = 'cat';
    const authForbidden = jest.fn();

    pubnub.setAuthForbidden(true);

    render(
      <Connection
        catKey={catKey}
        authSuccessful={jest.fn()}
        authFailed={jest.fn()}
        authForbidden={authForbidden}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={jest.fn()}
        catDetected={jest.fn()}
      />
    );

    await wait(() => {
      expect(authForbidden).toHaveBeenCalled();
    });
  });

  it('should call `authFailed` if there is a `catKey` and auth is unsuccessful', async () => {
    const catKey = 'cat';
    const authFailed = jest.fn();

    pubnub.setAuthFailed(true);

    render(
      <Connection
        catKey={catKey}
        authSuccessful={jest.fn()}
        authFailed={authFailed}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={jest.fn()}
        catDetected={jest.fn()}
      />
    );

    await wait(() => {
      expect(authFailed).toHaveBeenCalled();
    });
  });

  it(`should clear stored connection id and token and call \`connectionTimedOut\` if there is
      a \`catKey\` and connection request timed out`, async () => {
    const catKey = 'cat';
    const connectionToken = 'dog';
    const connectionTimedOut = jest.fn();

    sessionStorage.setItem(CONNECTION_TOKEN, connectionToken);

    render(
      <Connection
        catKey={catKey}
        authSuccessful={jest.fn()}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={connectionTimedOut}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={jest.fn()}
        catDetected={jest.fn()}
      />
    );

    await wait(() => {
      expect(pubnub.publish).toHaveBeenCalledWith(
        {
          channel: MESSAGE_CHANNEL,
          message: {
            [messages.CONNECTION_REQUEST]: mockConnectionId
          }
        },
        expect.any(Function)
      );
    });

    jest.advanceTimersByTime(CONNECTION_TIMEOUT_DELAY);

    expect(connectionTimedOut).toHaveBeenCalled();

    expect(sessionStorage.getItem(CONNECTION_ID)).toBeNull();
    expect(sessionStorage.getItem(CONNECTION_TOKEN)).toBeNull();
  });

  it(`should clear stored connection id and call \`disconnected\` if on cat route without
      \`catKey\` and no connection token is stored`, async () => {
    const disconnected = jest.fn();

    render(
      <Connection
        cat={true}
        authSuccessful={jest.fn()}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={disconnected}
        catDetected={jest.fn()}
      />
    );

    expect(disconnected).toHaveBeenCalled();
    expect(sessionStorage.getItem(CONNECTION_ID)).toBeNull();
  });

  it(`should authenticate and send heartbeat if on cat route without \`catKey\` and connection
      token is stored`, async () => {
    const connectionToken = 'dog';
    const authSuccessful = jest.fn();

    sessionStorage.setItem(CONNECTION_TOKEN, connectionToken);
    sessionStorage.setItem(CONNECTION_ID, mockConnectionId);

    render(
      <Connection
        cat={true}
        authSuccessful={authSuccessful}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={jest.fn()}
        catDetected={jest.fn()}
      />
    );

    await wait(() => {
      expect(authSuccessful).toHaveBeenCalled();
    });

    expect(pubnub.publish).toHaveBeenCalledWith(
      {
        channel: MESSAGE_CHANNEL,
        message: {
          [messages.CONNECTION_TEST]: mockConnectionId
        }
      },
      expect.any(Function)
    );
  });

  it('should send left turn request message if `turnLeft` is true', async () => {
    const catKey = 'cat';
    const authSuccessful = jest.fn();

    const { rerender } = render(
      <Connection
        catKey={catKey}
        authSuccessful={authSuccessful}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={jest.fn()}
        catDetected={jest.fn()}
      />
    );

    await wait(() => {
      expect(authSuccessful).toHaveBeenCalled();
    });

    rerender(
      <Connection
        catKey={catKey}
        turnLeft={true}
        authSuccessful={jest.fn()}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={jest.fn()}
        catDetected={jest.fn()}
      />
    );

    expect(pubnub.publish).toHaveBeenCalledWith(
      {
        channel: MESSAGE_CHANNEL,
        message: {
          [messages.LEFT_TURN_REQUEST]: mockConnectionId
        }
      },
      expect.any(Function)
    );
  });

  it('should send right turn request message if `turnRight` is true', async () => {
    const catKey = 'cat';
    const authSuccessful = jest.fn();

    const { rerender } = render(
      <Connection
        catKey={catKey}
        authSuccessful={authSuccessful}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={jest.fn()}
        catDetected={jest.fn()}
      />
    );

    await wait(() => {
      expect(authSuccessful).toHaveBeenCalled();
    });

    rerender(
      <Connection
        catKey={catKey}
        turnRight={true}
        authSuccessful={jest.fn()}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={jest.fn()}
        catDetected={jest.fn()}
      />
    );

    expect(pubnub.publish).toHaveBeenCalledWith(
      {
        channel: MESSAGE_CHANNEL,
        message: {
          [messages.RIGHT_TURN_REQUEST]: mockConnectionId
        }
      },
      expect.any(Function)
    );
  });

  it(`should store connection the token, call \`connectionSuccessful\`, and send heartbeat
      if it receives a connected message with matching connection id`, async () => {
    const catKey = 'cat';
    const connectionToken = 'dog';
    const anotherConnectionId = '123';
    const connectionSuccessful = jest.fn();

    render(
      <Connection
        catKey={catKey}
        authSuccessful={jest.fn()}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={connectionSuccessful}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={jest.fn()}
        catDetected={jest.fn()}
      />
    );

    await wait(() => {
      expect(pubnub.publish).toHaveBeenCalledWith(
        {
          channel: MESSAGE_CHANNEL,
          message: {
            [messages.CONNECTION_REQUEST]: mockConnectionId
          }
        },
        expect.any(Function)
      );
    });

    pubnub.sendMessage({
      [messages.CONNECTED]: anotherConnectionId,
      token: connectionToken
    });

    expect(connectionSuccessful).not.toHaveBeenCalled();

    expect(pubnub.publish).not.toHaveBeenCalledWith(
      {
        channel: MESSAGE_CHANNEL,
        message: {
          [messages.CONNECTION_TEST]: mockConnectionId
        }
      },
      expect.any(Function)
    );

    expect(sessionStorage.getItem(CONNECTION_TOKEN)).toBeNull();

    connectionSuccessful.mockClear();
    pubnub.publish.mockClear();

    pubnub.sendMessage({
      [messages.CONNECTED]: mockConnectionId,
      token: connectionToken
    });

    expect(connectionSuccessful).toHaveBeenCalled();

    expect(pubnub.publish).toHaveBeenCalledWith(
      {
        channel: MESSAGE_CHANNEL,
        message: {
          [messages.CONNECTION_TEST]: mockConnectionId
        }
      },
      expect.any(Function)
    );

    expect(sessionStorage.getItem(CONNECTION_TOKEN)).toEqual(connectionToken);
  });

  it(`should clear stored connection id and token and call \`disconnected\` if heartbeat
      times out`, async () => {
    const catKey = 'cat';
    const connectionToken = 'dog';
    const disconnected = jest.fn();

    render(
      <Connection
        catKey={catKey}
        authSuccessful={jest.fn()}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={disconnected}
        catDetected={jest.fn()}
      />
    );

    await wait(() => {
      expect(pubnub.publish).toHaveBeenCalledWith(
        {
          channel: MESSAGE_CHANNEL,
          message: {
            [messages.CONNECTION_REQUEST]: mockConnectionId
          }
        },
        expect.any(Function)
      );
    });

    pubnub.sendMessage({
      [messages.CONNECTED]: mockConnectionId,
      token: connectionToken
    });

    jest.advanceTimersByTime(HEARTBEAT_TIMEOUT_DELAY - 1);

    expect(disconnected).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(CONNECTION_ID)).toEqual(mockConnectionId);
    expect(sessionStorage.getItem(CONNECTION_TOKEN)).toEqual(connectionToken);

    disconnected.mockClear();

    pubnub.sendMessage({
      [messages.CONNECTION_OK]: mockConnectionId,
      token: connectionToken
    });

    jest.advanceTimersByTime(HEARTBEAT_INTERVAL + HEARTBEAT_TIMEOUT_DELAY);

    expect(disconnected).toHaveBeenCalled();
    expect(sessionStorage.getItem(CONNECTION_ID)).toBeNull();
    expect(sessionStorage.getItem(CONNECTION_TOKEN)).toBeNull();
  });

  it(`should clear stored connection id and call \`connectionConflict\` if it receives a
      conflict message with matching connection id`, async () => {
    const catKey = 'cat';
    const anotherConnectionId = '123';
    const authSuccessful = jest.fn();
    const connectionConflict = jest.fn();

    render(
      <Connection
        catKey={catKey}
        authSuccessful={authSuccessful}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={connectionConflict}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={jest.fn()}
        catDetected={jest.fn()}
      />
    );

    await wait(() => {
      expect(authSuccessful).toHaveBeenCalled();
    });

    pubnub.sendMessage({
      [messages.CONFLICT]: anotherConnectionId
    });

    expect(connectionConflict).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(CONNECTION_ID)).toEqual(mockConnectionId);

    connectionConflict.mockClear();

    pubnub.sendMessage({
      [messages.CONFLICT]: mockConnectionId
    });

    expect(connectionConflict).toHaveBeenCalled();
    expect(sessionStorage.getItem(CONNECTION_ID)).toBeNull();
  });

  it(`should clear the heartbeat timeout and schedule another heartbeat if it receives a
      heartbeat response message with matching connection id`, async () => {
    const catKey = 'cat';
    const connectionToken = 'dog';
    const anotherConnectionId = '123';
    const disconnected = jest.fn();

    render(
      <Connection
        catKey={catKey}
        authSuccessful={jest.fn()}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={disconnected}
        catDetected={jest.fn()}
      />
    );

    await wait(() => {
      expect(pubnub.publish).toHaveBeenCalledWith(
        {
          channel: MESSAGE_CHANNEL,
          message: {
            [messages.CONNECTION_REQUEST]: mockConnectionId
          }
        },
        expect.any(Function)
      );
    });

    pubnub.sendMessage({
      [messages.CONNECTED]: mockConnectionId,
      token: connectionToken
    });

    jest.advanceTimersByTime(HEARTBEAT_TIMEOUT_DELAY - 1);

    pubnub.sendMessage({
      [messages.CONNECTION_OK]: anotherConnectionId,
      token: connectionToken
    });

    jest.advanceTimersByTime(1);

    expect(disconnected).toHaveBeenCalled();
    expect(sessionStorage.getItem(CONNECTION_ID)).toBeNull();
    expect(sessionStorage.getItem(CONNECTION_TOKEN)).toBeNull();

    pubnub.publish.mockClear();
    jest.advanceTimersByTime(HEARTBEAT_INTERVAL);

    expect(pubnub.publish).not.toHaveBeenCalledWith(
      {
        channel: MESSAGE_CHANNEL,
        message: {
          [messages.CONNECTION_TEST]: mockConnectionId
        }
      },
      expect.any(Function)
    );

    disconnected.mockClear();
    pubnub.publish.mockClear();

    render(
      <Connection
        catKey={catKey}
        authSuccessful={jest.fn()}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={disconnected}
        catDetected={jest.fn()}
      />
    );

    await wait(() => {
      expect(pubnub.publish).toHaveBeenCalledWith(
        {
          channel: MESSAGE_CHANNEL,
          message: {
            [messages.CONNECTION_REQUEST]: mockConnectionId
          }
        },
        expect.any(Function)
      );
    });

    pubnub.sendMessage({
      [messages.CONNECTED]: mockConnectionId,
      token: connectionToken
    });

    jest.advanceTimersByTime(HEARTBEAT_TIMEOUT_DELAY - 1);

    pubnub.sendMessage({
      [messages.CONNECTION_OK]: mockConnectionId,
      token: connectionToken
    });

    jest.advanceTimersByTime(1);

    expect(disconnected).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(CONNECTION_ID)).toEqual(mockConnectionId);
    expect(sessionStorage.getItem(CONNECTION_TOKEN)).toEqual(connectionToken);

    pubnub.publish.mockClear();
    jest.advanceTimersByTime(HEARTBEAT_INTERVAL);

    expect(pubnub.publish).toHaveBeenCalledWith(
      {
        channel: MESSAGE_CHANNEL,
        message: {
          [messages.CONNECTION_TEST]: mockConnectionId
        }
      },
      expect.any(Function)
    );
  });

  it('call `robotCurrentlyTurning` if it receives a turn in progress message', async () => {
    const catKey = 'cat';
    const robotCurrentlyTurning = jest.fn();

    render(
      <Connection
        catKey={catKey}
        authSuccessful={jest.fn()}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={robotCurrentlyTurning}
        disconnected={jest.fn()}
        catDetected={jest.fn()}
      />
    );

    await wait(() => {
      expect(pubnub.publish).toHaveBeenCalledWith(
        {
          channel: MESSAGE_CHANNEL,
          message: {
            [messages.CONNECTION_REQUEST]: mockConnectionId
          }
        },
        expect.any(Function)
      );
    });

    pubnub.sendMessage({
      [messages.CONNECTED]: mockConnectionId
    });

    pubnub.sendMessage(messages.TURN_IN_PROGRESS);

    expect(robotCurrentlyTurning).toHaveBeenCalled();
  });

  it('call `robotTurningLeft` if it receives a turning left message', async () => {
    const catKey = 'cat';
    const robotTurningLeft = jest.fn();

    render(
      <Connection
        catKey={catKey}
        authSuccessful={jest.fn()}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={robotTurningLeft}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={jest.fn()}
        catDetected={jest.fn()}
      />
    );

    await wait(() => {
      expect(pubnub.publish).toHaveBeenCalledWith(
        {
          channel: MESSAGE_CHANNEL,
          message: {
            [messages.CONNECTION_REQUEST]: mockConnectionId
          }
        },
        expect.any(Function)
      );
    });

    pubnub.sendMessage({
      [messages.CONNECTED]: mockConnectionId
    });

    pubnub.sendMessage(messages.TURNING_LEFT);

    expect(robotTurningLeft).toHaveBeenCalled();
  });

  it('call `robotTurningRight` if it receives a turning right message', async () => {
    const catKey = 'cat';
    const robotTurningRight = jest.fn();

    render(
      <Connection
        catKey={catKey}
        authSuccessful={jest.fn()}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={robotTurningRight}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={jest.fn()}
        catDetected={jest.fn()}
      />
    );

    await wait(() => {
      expect(pubnub.publish).toHaveBeenCalledWith(
        {
          channel: MESSAGE_CHANNEL,
          message: {
            [messages.CONNECTION_REQUEST]: mockConnectionId
          }
        },
        expect.any(Function)
      );
    });

    pubnub.sendMessage({
      [messages.CONNECTED]: mockConnectionId
    });

    pubnub.sendMessage(messages.TURNING_RIGHT);

    expect(robotTurningRight).toHaveBeenCalled();
  });

  it('call `robotCompletedTurn` if it receives a turn completed message', async () => {
    const catKey = 'cat';
    const robotCompletedTurn = jest.fn();

    render(
      <Connection
        catKey={catKey}
        authSuccessful={jest.fn()}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={robotCompletedTurn}
        robotCurrentlyTurning={jest.fn()}
        disconnected={jest.fn()}
        catDetected={jest.fn()}
      />
    );

    await wait(() => {
      expect(pubnub.publish).toHaveBeenCalledWith(
        {
          channel: MESSAGE_CHANNEL,
          message: {
            [messages.CONNECTION_REQUEST]: mockConnectionId
          }
        },
        expect.any(Function)
      );
    });

    pubnub.sendMessage({
      [messages.CONNECTED]: mockConnectionId
    });

    pubnub.sendMessage(messages.TURN_COMPLETED);

    expect(robotCompletedTurn).toHaveBeenCalled();
  });

  it('call `catDetected` if it receives a cat detected message', async () => {
    const catKey = 'cat';
    const catDetected = jest.fn();

    render(
      <Connection
        catKey={catKey}
        authSuccessful={jest.fn()}
        authFailed={jest.fn()}
        authForbidden={jest.fn()}
        connectionSuccessful={jest.fn()}
        connectionTimedOut={jest.fn()}
        connectionConflict={jest.fn()}
        robotTurningRight={jest.fn()}
        robotTurningLeft={jest.fn()}
        robotCompletedTurn={jest.fn()}
        robotCurrentlyTurning={jest.fn()}
        disconnected={jest.fn()}
        catDetected={catDetected}
      />
    );

    await wait(() => {
      expect(pubnub.publish).toHaveBeenCalledWith(
        {
          channel: MESSAGE_CHANNEL,
          message: {
            [messages.CONNECTION_REQUEST]: mockConnectionId
          }
        },
        expect.any(Function)
      );
    });

    pubnub.sendMessage({
      [messages.CONNECTED]: mockConnectionId
    });

    pubnub.sendMessage(messages.CAT_DETECTED);

    expect(catDetected).toHaveBeenCalled();
  });
});
