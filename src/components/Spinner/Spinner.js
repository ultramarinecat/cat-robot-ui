//
// Spinner
//

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import styles from './Spinner.module.scss';
import 'load-awesome/css/ball-clip-rotate.css';

export function Spinner({ spinning = true }) {
  const spinnerClasses = classNames(
    styles.main,
    { invisible: !spinning },
    'la-ball-clip-rotate',
    'la-sm'
  );

  return (
    <div className={spinnerClasses} data-testid="spinner">
      <div />
    </div>
  );
}

Spinner.propTypes = {
  spinning: PropTypes.bool
};

export default memo(Spinner);
