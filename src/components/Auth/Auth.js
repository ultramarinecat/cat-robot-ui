//
// Auth component
// Manages authenticating and connecting to robot
//

import React, { memo, useState, useEffect, useCallback, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';
import { isAlphanumeric, isByteLength } from 'validator';
import classNames from 'classnames';

import { connectToRobot } from './AuthActions.js';
import Button from '../Button/Button.js';
import Spinner from '../Spinner/Spinner.js';

import styles from './Auth.module.scss';

const CONNECTION_START = 'CONNECTION_START';
const CONNECTION_FAILED = 'CONNECTION_FAILED';
const INPUT_CHANGED = 'INPUT_CHANGED';
const INPUT_INVALID_ON_SUBMIT = 'SUBMIT_INPUT_INVALID';

export const MIN_KEY_LENGTH = 1;
export const MAX_KEY_LENGTH = 16;

export function Auth({
  connecting,
  connectionTimedOut,
  connectionConflict,
  authFailed,
  connectToRobot,
  t
}) {
  const startValidating = useRef(false);
  const [catKey, setCatKey] = useState('');

  const [
    { disableInput, disableButton, displaySpinner, feedback },
    dispatch
  ] = useReducer(authReducer, {
    disableInput: false,
    disableButton: false,
    displaySpinner: false,
    feedback: ''
  });

  const handleInputChange = useCallback(event => {
    const catKeyValue = event.target.value.trim();

    setCatKey(catKeyValue);

    // don't start validating until inital submit
    if (!startValidating.current) {
      return;
    }

    dispatch({
      type: INPUT_CHANGED,
      isValid: isValidKey(catKeyValue),
      feedback: t('auth_validation_cat_key')
    });
  });

  const handleInputKeyPress = useCallback(event => {
    // handle enter as submit click
    if (event.charCode === 13) {
      handleSubmit(event);
    }
  });

  const handleSubmit = useCallback(event => {
    event.preventDefault();
    startValidating.current = true;

    if (!isValidKey(catKey)) {
      dispatch({
        type: INPUT_INVALID_ON_SUBMIT,
        feedback: t('auth_validation_cat_key')
      });

      return;
    }

    // if input valid, attempt to connect
    dispatch({
      type: CONNECTION_START
    });

    connectToRobot(catKey);
  });

  useEffect(() => {
    if (authFailed) {
      dispatch({
        type: CONNECTION_FAILED,
        feedback: t('auth_invalid')
      });

      return;
    }

    if (connectionTimedOut) {
      dispatch({
        type: CONNECTION_FAILED,
        feedback: t('auth_connection_failed')
      });

      return;
    }

    if (connectionConflict) {
      dispatch({
        type: CONNECTION_FAILED,
        feedback: t('auth_connection_conflict')
      });
    }
  }, [connecting, connectionTimedOut, connectionConflict, authFailed]);

  const labelClasses = classNames(styles.label, 'col-sm-2', 'd-none', 'd-sm-block');
  const feedbackClasses = classNames(
    styles.feedback,
    { invisible: !feedback },
    'col-sm-10',
    'offset-sm-2'
  );

  return (
    <div className={styles.main}>
      <form className={styles.form} noValidate>
        <fieldset>
          <legend className={styles.legend}>{t('auth_instructions')}</legend>
          <div className="row">
            <label className={labelClasses} htmlFor="cat-key">
              {t('auth_cat_key')}
            </label>
            <div className="col-sm-10">
              <input
                className="form-control"
                type="text"
                value={catKey}
                disabled={disableInput}
                onChange={handleInputChange}
                onKeyPress={handleInputKeyPress}
                id="cat-key"
                name="cat-key"
                placeholder={t('auth_placeholder')}
                required
              />
            </div>
          </div>
        </fieldset>

        <div className="row">
          <div className={feedbackClasses} data-testid="feedback">
            {feedback}
          </div>
        </div>

        <div>
          <Button
            text={t('auth_connect')}
            disabled={disableButton}
            onClick={handleSubmit}
            data-testid="button"
          />
          <Spinner spinning={displaySpinner} data-testid="spinner" />
        </div>
      </form>
    </div>
  );
}

export function authReducer(state, action) {
  switch (action.type) {
    case CONNECTION_START: {
      return {
        ...state,
        displaySpinner: true,
        disableButton: true,
        disableInput: true,
        feedback: ''
      };
    }
    case CONNECTION_FAILED: {
      const { feedback } = action;
      return {
        ...state,
        displaySpinner: false,
        disableButton: false,
        disableInput: false,
        feedback
      };
    }
    case INPUT_CHANGED:
      const { isValid, feedback } = action;
      return {
        ...state,
        disableButton: !isValid,
        feedback: !isValid ? feedback : ''
      };
    case INPUT_INVALID_ON_SUBMIT: {
      const { feedback } = action;
      return {
        ...state,
        disableButton: true,
        feedback
      };
    }
    default:
      return state;
  }
}

function isValidKey(key) {
  return (
    isByteLength(key, { min: MIN_KEY_LENGTH, max: MAX_KEY_LENGTH }) && isAlphanumeric(key)
  );
}

Auth.propTypes = {
  connecting: PropTypes.bool,
  connectionTimedOut: PropTypes.bool,
  connectionConflict: PropTypes.bool,
  authFailed: PropTypes.bool,
  connectToRobot: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    connecting: state.auth.connecting,
    connectionTimedOut: state.auth.connectionTimedOut,
    connectionConflict: state.auth.connectionConflict,
    authFailed: state.auth.authFailed
  };
};

export default connect(
  mapStateToProps,
  { connectToRobot }
)(memo(withTranslation()(Auth)));
