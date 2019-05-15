//
// Mute button
// Updates icon based on muted state
//

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import styles from './Mute.module.scss';

const MUTE_ICON = 'volume_down';
const UNMUTE_ICON = 'volume_mute';

export function Mute({ isMuted, onClick }) {
  const muteButtonIcon = isMuted ? UNMUTE_ICON : MUTE_ICON;

  return (
    <span onClick={onClick} data-testid="mute">
      <i
        className={`${styles.main} material-icons`}
        data-testid={isMuted ? 'unmute-icon' : 'mute-icon'}
      >
        {muteButtonIcon}
      </i>
    </span>
  );
}

Mute.propTypes = {
  isMuted: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default memo(Mute);
