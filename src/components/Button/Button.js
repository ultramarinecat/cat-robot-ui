//
// Button
//

import React, { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Waves from 'node-waves';
import 'node-waves/src/scss/waves.scss';

import styles from './Button.module.scss';

const WAVES_CLASS = 'waves-light';
const WAVES_DURACTION = 500;

export function Button({ text, disabled = false, onClick }) {
  const el = useRef(null);

  useEffect(() => {
    Waves.attach(`.${styles.main}`, WAVES_CLASS);

    Waves.init({
      duration: WAVES_DURACTION
    });
  }, []);

  useEffect(() => {
    if (disabled) {
      el.current.classList.add(styles.disabled);
    } else {
      el.current.classList.remove(styles.disabled);
    }
  }, [disabled]);

  return (
    <button className={styles.main} onClick={onClick} ref={el} type="button">
      {text}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default memo(Button);
