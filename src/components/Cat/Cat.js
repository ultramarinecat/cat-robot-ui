//
// Cat component
// Manages interaction with cat robot by sending messages based on device orientation events
// and displays updates
//

import React, { memo, useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';
import log from 'loglevel';

import GyroNorm from 'gyronorm';
import './fulltilt.js';

import Pulse from '../Pulse/Pulse.js';
import Sound from '../Sound/Sound.js';
import Typing from '../Typing/Typing.js';

import { leftTilt, rightTilt } from './CatActions.js';

import styles from './Cat.module.scss';

export const REGISTER_TILT_ANGLE = 20;
export const TURN_REQUEST_MIN_INTERVAL = 5000;
const ORIENTATION_EVENT_FREQUENCY = 300;

const PLAY_CAT_SOUND = 'PLAY_CAT_SOUND';
const PLAY_TURNING_SOUND = 'PLAY_TURNING_SOUND';

const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

let gyronorm;
let timeLastTurnRequest;
let tiltCleared = false;

export function Cat({
  catDetected,
  robotCurrentlyTurning,
  robotTurningLeft,
  robotTurningRight,
  robotCompletedTurn,
  disconnected,
  leftTilt,
  rightTilt,
  t
}) {
  const [{ catSound, turningSound, updateSound }, dispatch] = useReducer(catReducer, {
    catSound: false,
    turningSound: false,
    updateSound: false // update even if sound is the same
  });

  const [status, setStatus] = useState(t('connected'));

  useEffect(() => {
    startListeningForOrientationEvents(leftTilt, rightTilt, dispatch)
      .then(() => {
        log.info('listeining for device orientation events');
      })
      .catch(e => {
        log.warn('a problem occured initializing gyronorm', e);
        setStatus(t('device_not_supported'));
      });

    return stopListeningForOrientationEvents;
  }, []);

  useEffect(() => {
    if (disconnected) {
      stopListeningForOrientationEvents();
      setStatus(t('disconnected'));
      return;
    }

    if (catDetected) {
      setStatus(t('cat_detected'));
      // play cat sound when cat is detected!
      dispatch({ type: PLAY_CAT_SOUND });
      return;
    }

    if (robotCurrentlyTurning) {
      setStatus(t('currently_turning'));
      return;
    }

    if (robotTurningLeft) {
      setStatus(t('turning_left'));
      return;
    }

    if (robotTurningRight) {
      setStatus(t('turning_right'));
      return;
    }

    if (robotCompletedTurn) {
      setStatus(t('turn_completed'));
    }
  }, [
    catDetected,
    robotCurrentlyTurning,
    robotTurningLeft,
    robotTurningRight,
    robotCompletedTurn,
    disconnected
  ]);

  return (
    <div className={styles.main}>
      <Pulse />
      <Typing text={status} datatest-id="status" />

      <Sound
        playCatSound={catSound}
        playTurningSound={turningSound}
        updateSound={updateSound}
        data-testid="sound"
      />
    </div>
  );
}

// start listening for orientation events
function startListeningForOrientationEvents(leftTilt, rightTilt, dispatch) {
  gyronorm = new GyroNorm();
  const options = {
    frequency: ORIENTATION_EVENT_FREQUENCY
  };

  // listen for orientation events
  return gyronorm.init(options).then(() => {
    gyronorm.start(data => {
      // get device orientation around y-axis
      const tiltAngle = data.do.gamma;
      log.trace('tilt angle:', tiltAngle);

      // if angle < min angle to register tilt, clear current tilt
      if (Math.abs(tiltAngle) < REGISTER_TILT_ANGLE) {
        if (!tiltCleared) {
          log.trace('cleared tilt');
          tiltCleared = true;
        }

        return;
      }

      // if angle > min angle to register tilt, and current tilt has been cleared
      if (tiltCleared) {
        // register tilt
        const direction = tiltAngle > 0 ? RIGHT : LEFT;
        registerTilt(direction, leftTilt, rightTilt, dispatch);
        tiltCleared = false;
      }
    });
  });
}

// stop listening for orientation events
function stopListeningForOrientationEvents() {
  if (gyronorm.isRunning()) {
    gyronorm.end();
  }
}

// register tilt, send turn request
function registerTilt(tiltDirection, leftTilt, rightTilt, dispatch) {
  // if time since last turn request < TURN_REQUEST_MIN_INTERVAL, ignore
  const timeTurnRequest = Date.now();

  if (
    timeLastTurnRequest != null &&
    timeTurnRequest - timeLastTurnRequest < TURN_REQUEST_MIN_INTERVAL
  ) {
    log.trace(`skipping ${tiltDirection} tilt`);
    return;
  }

  // note time of turn request, play registered turn sound
  timeLastTurnRequest = timeTurnRequest;
  dispatch({ type: PLAY_TURNING_SOUND });

  // send turn request
  if (tiltDirection === LEFT) {
    leftTilt();
  } else {
    rightTilt();
  }
}

function catReducer(state, action) {
  switch (action.type) {
    case PLAY_CAT_SOUND:
      return {
        ...state,
        catSound: true,
        turningSound: false,
        updateSound: !state.updateSound
      };
    case PLAY_TURNING_SOUND:
      return {
        ...state,
        turningSound: true,
        catSound: false,
        updateSound: !state.updateSound
      };
    default:
      return state;
  }
}

Cat.propTypes = {
  catDetected: PropTypes.bool,
  robotCurrentlyTurning: PropTypes.bool,
  robotTurningLeft: PropTypes.bool,
  robotTurningRight: PropTypes.bool,
  robotCompletedTurn: PropTypes.bool,
  disconnected: PropTypes.bool,
  leftTilt: PropTypes.func.isRequired,
  rightTilt: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    catDetected: state.cat.catDetected,
    robotCurrentlyTurning: state.cat.robotCurrentlyTurning,
    robotTurningLeft: state.cat.robotTurningLeft,
    robotTurningRight: state.cat.robotTurningRight,
    robotCompletedTurn: state.cat.robotCompletedTurn,
    disconnected: state.cat.disconnected
  };
};

export default connect(
  mapStateToProps,
  {
    leftTilt,
    rightTilt
  }
)(memo(withTranslation()(Cat)));
