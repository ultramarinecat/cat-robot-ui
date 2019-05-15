//
// Intro
// App landing page
//

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';

import { introContinueAsync } from './IntroActions.js';
import Button from '../Button/Button.js';

import styles from './Intro.module.scss';

export function Intro({ introContinue, t }) {
  return (
    <div>
      <h2 className={styles.description}>{t('app_description')}</h2>
      <Button text={t('get_started')} onClick={introContinue} />
    </div>
  );
}

Intro.propTypes = {
  introContinue: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default connect(
  null,
  { introContinue: introContinueAsync }
)(memo(withTranslation()(Intro)));
