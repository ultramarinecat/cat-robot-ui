//
// App
//

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';
import log from 'loglevel';

import Particles from '../Particles/Particles.js';
import Router from '../Router/Router.js';
import './i18n.js';

import './bootstrap.scss';
import styles from './App.module.scss';

log.setDefaultLevel(process.env.REACT_APP_LOG_LEVEL);

export function App({ t }) {
  return (
    <div className={styles.main}>
      <Particles />
      <nav>
        <h1 className={`${styles.logo} text-center`}>{t('app_name')}</h1>
      </nav>
      <main>
        <div className="container-fluid">
          <Router />
        </div>
      </main>
    </div>
  );
}

App.propTypes = {
  t: PropTypes.func.isRequired
};

export default memo(withTranslation()(App));
