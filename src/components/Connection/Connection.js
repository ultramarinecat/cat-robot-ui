//
// Connection
// Manages connection with robot, subscribes to robot events
//

import React, { memo, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PubNub from 'pubnub';
import uuidv4 from 'uuid/v4';
import log from 'loglevel';

import * as actions from './ConnectionActions.js';
import * as messages from './messages.js';

export const MESSAGE_CHANNEL = 'MESSAGE';
export const CONNECTION_TOKEN = 'connectionToken';
export const CONNECTION_ID = 'connectionId';

export const CONNECTION_TIMEOUT_DELAY = 15000; //10000;
export const HEARTBEAT_TIMEOUT_DELAY = 15000;

export const HEARTBEAT_INTERVAL = 3000;
const FORBIDDEN = 403;

let pubnub;
let connectionTimeout;
let heartbeatTimeout;

export function Connection({
  authSuccessful,
  authForbidden,
  authFailed,
  connectionTimedOut,
  turnLeft,
  turnRight,
  updateTurn,
  cat,
  catKey = null,
  ...messages
}) {
  useEffect(() => {
    if (catKey) {
      // setup connection timeout
      connectionTimeout = setTimeout(() => {
        // if timed out, unsubscribe from messages and notify app
        clearConnection();
        connectionTimedOut();
      }, CONNECTION_TIMEOUT_DELAY);

      // authenticate with robot
      initPubnub(catKey)
        // check if authenticated
        .then(() => {
          return checkAuth(authSuccessful, authForbidden, authFailed);
        })
        // subscribe to messages
        .then(() => {
          return subscribe(messages);
        })
        // send connection request
        .then(() => {
          return connectToRobot();
        })
        // eslint-disable-next-line no-unused-vars
        .catch(e => {
          log.info('could not connect to cat robot');
        });
    }

    return unsubscribe;
  }, [catKey]);

  useEffect(() => {
    if (turnLeft) {
      requestLeftTurn();
      return;
    }

    if (turnRight) {
      requestRightTurn();
    }
  }, [turnLeft, turnRight, updateTurn]);

  useEffect(() => {
    if (cat && !catKey) {
      const connectionToken = getConnectionToken();
      if (!connectionToken) {
        clearConnection();
        messages.disconnected();
        return;
      }

      // try to reconnect with connection token
      initPubnub(connectionToken)
        // check if authenticated
        .then(() => {
          return checkAuth(authSuccessful, authForbidden, authFailed, true);
        })
        // subscribe to messages
        .then(() => {
          return subscribe(messages);
        })
        // start heartbeat
        .then(() => {
          sendHeartbeat(messages.disconnected);
        })
        // eslint-disable-next-line no-unused-vars
        .catch(e => {
          log.info('could not reconnect');
        });
    }
  }, [catKey]);

  return null;
}

// initialize pubnub
function initPubnub(catKey) {
  return new Promise((resolve, reject) => {
    pubnub = new PubNub({
      publishKey: process.env.REACT_APP_PUBLISH_KEY,
      subscribeKey: process.env.REACT_APP_SUBSCRIBE_KEY,
      authKey: catKey,
      ssl: true
    });

    resolve();
  });
}

// send test message to check auth
function checkAuth(authSuccessful, authForbidden, authFailed, isReconnect) {
  return new Promise((resolve, reject) => {
    pubnub.publish(
      {
        channel: MESSAGE_CHANNEL,
        message: messages.AUTH
      },
      ({ error, statusCode }) => {
        if (statusCode === FORBIDDEN) {
          log.info('authentication failed, invalid key');

          // clear connection timeout
          clearTimeout(connectionTimeout);

          authForbidden(isReconnect);
          reject();
          return;
        }

        if (error) {
          log.info('authentication failed');

          // clear connection timeout
          clearTimeout(connectionTimeout);

          authFailed(isReconnect);
          reject();
          return;
        }

        log.info('authenticated');
        authSuccessful();
        resolve();
      }
    );
  });
}

// subscribe to pubnub messages channel, handle incoming messages
function subscribe({
  connectionSuccessful,
  connectionConflict,
  robotCurrentlyTurning,
  robotTurningLeft,
  robotTurningRight,
  robotCompletedTurn,
  catDetected,
  disconnected
}) {
  return new Promise((resolve, reject) => {
    pubnub.addListener({
      message: ({ message }) => {
        if (message[messages.CONNECTED]) {
          if (message[messages.CONNECTED] !== getConnectionId()) {
            return;
          }
          handleConnectedMessage(message.token, connectionSuccessful, disconnected);
          return;
        }

        if (message[messages.CONFLICT]) {
          if (message[messages.CONFLICT] !== getConnectionId()) {
            return;
          }
          handleConnectionConflictMessage(connectionConflict);
          return;
        }

        if (message[messages.CONNECTION_OK]) {
          if (message[messages.CONNECTION_OK] !== getConnectionId()) {
            return;
          }
          handleHeartbeatResponseMessage(disconnected);
          return;
        }

        if (message === messages.TURN_IN_PROGRESS) {
          handleTurnInProgressMessage(robotCurrentlyTurning);
          return;
        }

        if (message === messages.TURNING_LEFT) {
          handleLeftTurnAcceptedMessage(robotTurningLeft);
          return;
        }

        if (message === messages.TURNING_RIGHT) {
          handleRightTurnAcceptedMessage(robotTurningRight);
          return;
        }

        if (message === messages.TURN_COMPLETED) {
          handleTurnCompletedMessage(robotCompletedTurn);
          return;
        }

        if (message === messages.CAT_DETECTED) {
          handleCatDetectedMessage(catDetected);
        }
      }
    });

    pubnub.subscribe({
      channels: [MESSAGE_CHANNEL]
    });

    resolve();
  });
}

// send connection request
function connectToRobot() {
  const connectionId = uuidv4();
  setConnectionId(connectionId);

  return new Promise((resolve, reject) => {
    pubnub.publish(
      {
        channel: MESSAGE_CHANNEL,
        message: {
          [messages.CONNECTION_REQUEST]: getConnectionId()
        }
      },
      ({ error }) => {
        if (error) {
          log.error('error occurred sending connection message');
          reject();
          return;
        }

        log.info('sent connection message');
        resolve();
      }
    );
  });
}

// send heartbeat
function sendHeartbeat(disconnected) {
  // setup heartbeat timeout
  heartbeatTimeout = setTimeout(() => {
    // if timed out, unsubscribe from messages and notify app of disconnection
    log.info('heartbeat timed out!');

    clearConnection();
    disconnected();
  }, HEARTBEAT_TIMEOUT_DELAY);

  // send heartbeat message with connection id
  pubnub.publish(
    {
      channel: MESSAGE_CHANNEL,
      message: {
        [messages.CONNECTION_TEST]: getConnectionId()
      }
    },
    ({ error }) => {
      if (error) {
        log.error('error occured sending heartbeat');
        return;
      }

      log.trace('sent heartbeat');
    }
  );
}

// send right turn request
function requestRightTurn() {
  // send turn request with connection id
  pubnub.publish(
    {
      channel: MESSAGE_CHANNEL,
      message: {
        [messages.RIGHT_TURN_REQUEST]: getConnectionId()
      }
    },
    ({ error }) => {
      if (error) {
        log.error('error occurred sending turn right request');
        return;
      }

      log.info('sent turn right request');
    }
  );
}

// send left turn request
function requestLeftTurn() {
  // send turn request with connection id
  pubnub.publish(
    {
      channel: MESSAGE_CHANNEL,
      message: {
        [messages.LEFT_TURN_REQUEST]: getConnectionId()
      }
    },
    ({ error }) => {
      if (error) {
        log.error('error occurred sending turn left request');
        return;
      }

      log.info('sent turn left request');
    }
  );
}

// handle connected message
function handleConnectedMessage(connectionToken, connectionSuccessful, disconnected) {
  log.info('connected to robot');

  // clear connection timeout
  clearTimeout(connectionTimeout);

  // store connection token in session storage
  setConnectionToken(connectionToken);

  connectionSuccessful();

  // send heartbeat
  sendHeartbeat(disconnected);
}

// handle connection conflict message
function handleConnectionConflictMessage(connectionConflict) {
  log.info('robot already has another connection');

  // clear connection timeout and unsubscribe
  clearTimeout(connectionTimeout);
  clearConnection();

  connectionConflict();
}

// handle heartbeat response
function handleHeartbeatResponseMessage(disconnected) {
  log.trace('connection ok');

  // queue up next heartbeat
  clearTimeout(heartbeatTimeout);
  setTimeout(() => {
    sendHeartbeat(disconnected);
  }, HEARTBEAT_INTERVAL);
}

// handle turn on progress message
function handleTurnInProgressMessage(robotCurrentlyTurning) {
  log.info('turn request rejected, turn in progress');

  // notify app
  robotCurrentlyTurning();
}

// handle left turn accepted message
function handleLeftTurnAcceptedMessage(robotTurningLeft) {
  log.info('left turn request accepted');

  // notify app that robot is turning left
  robotTurningLeft();
}

// handle right turn accepted message
function handleRightTurnAcceptedMessage(robotTurningRight) {
  log.info('right turn request accepted');

  // notify app that robot is turning right
  robotTurningRight();
}

// handle turn completed message
function handleTurnCompletedMessage(robotCompletedTurn) {
  log.info('turn completed');

  // notify app that robot is done turning
  robotCompletedTurn();
}

// handle cat detected message
function handleCatDetectedMessage(catDetected) {
  log.info('cat detected');

  // notify app that cat detected
  catDetected();
}

// get stored connection token
function getConnectionToken() {
  return sessionStorage.getItem(CONNECTION_TOKEN);
}

// get stored connectionId
function getConnectionId() {
  return sessionStorage.getItem(CONNECTION_ID);
}

// store connection token
function setConnectionToken(connectionToken) {
  sessionStorage.setItem(CONNECTION_TOKEN, connectionToken);
}

// store connection id
function setConnectionId(connectionId) {
  sessionStorage.setItem(CONNECTION_ID, connectionId);
}

// clear stored connection id and token and unsubscribe from messages
function clearConnection() {
  sessionStorage.clear();
  unsubscribe();
}

// unsubscribe from pubnub messages
function unsubscribe() {
  if (pubnub) {
    pubnub.unsubscribeAll();
  }
}

Connection.propTypes = {
  cat: PropTypes.bool,
  catKey: PropTypes.string,
  turnLeft: PropTypes.bool,
  turnRight: PropTypes.bool,
  authSuccessful: PropTypes.func.isRequired,
  authFailed: PropTypes.func.isRequired,
  authForbidden: PropTypes.func.isRequired,
  connectionSuccessful: PropTypes.func.isRequired,
  connectionTimedOut: PropTypes.func.isRequired,
  connectionConflict: PropTypes.func.isRequired,
  robotTurningRight: PropTypes.func.isRequired,
  robotTurningLeft: PropTypes.func.isRequired,
  robotCompletedTurn: PropTypes.func.isRequired,
  robotCurrentlyTurning: PropTypes.func.isRequired,
  disconnected: PropTypes.func.isRequired,
  catDetected: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    catKey: state.connection.catKey,
    turnLeft: state.connection.turnLeft,
    turnRight: state.connection.turnRight,
    updateTurn: state.connection.updateTurn
  };
};

export default connect(
  mapStateToProps,
  {
    authSuccessful: actions.authSuccessful,
    authFailed: actions.authFailedAsync,
    authForbidden: actions.authForbiddenAsync,
    connectionSuccessful: actions.connectionSuccessfulAsync,
    connectionTimedOut: actions.connectionTimedOut,
    connectionConflict: actions.connectionConflict,
    robotTurningRight: actions.robotTurningRight,
    robotTurningLeft: actions.robotTurningLeft,
    robotCompletedTurn: actions.robotCompletedTurn,
    robotCurrentlyTurning: actions.robotCurrentlyTurning,
    disconnected: actions.disconnectedAsync,
    catDetected: actions.catDetectedAsync
  }
)(memo(Connection));
