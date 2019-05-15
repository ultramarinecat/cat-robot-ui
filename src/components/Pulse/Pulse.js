//
// Pulse animation
//

import React, { memo } from 'react';

import styles from './Pulse.module.scss';
import 'load-awesome/css/ball-scale-pulse.css';

export function Pulse() {
  return (
    <div className={`${styles.main} la-ball-scale-pulse la-3x`} data-testid="pulse">
      <div />
      <div />
    </div>
  );
}

export default memo(Pulse);
