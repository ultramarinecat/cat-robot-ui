//
// Typing effect
// Displays text simulating typewritter effect
//

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';

import theaterJS from 'theaterjs';

import styles from './Typing.module.scss';

const THEATER_SPEED = 1.0;
const THEATER_ACCURACY = 0.8;
const THEATER_WAIT = 500;
const THEATER_ACTOR = 'status';

let theater;

export function Typing({ text }) {
  useEffect(() => {
    theater = theaterJS();

    // init theater
    theater.addActor(
      THEATER_ACTOR,
      {
        speed: THEATER_SPEED,
        accuracy: THEATER_ACCURACY
      },
      `.${styles.main}`
    );
  }, []);

  useEffect(() => {
    if (theater) {
      // type text
      theater.addScene(`${THEATER_ACTOR}:${text}`, THEATER_WAIT);
    }
  }, [text]);

  return <div className={styles.main} data-testid="typing" />;
}

Typing.propTypes = {
  text: PropTypes.string.isRequired
};

export default memo(Typing);
