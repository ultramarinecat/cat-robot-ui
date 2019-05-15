//
// Main error boundary, displays fallback ui indicating that an error has occurred
//

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import styles from './ErrorBoundary.module.scss';

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static propTypes = {
    t: PropTypes.func.isRequired
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    // if error, display fallback ui
    if (this.state.hasError) {
      const { t } = this.props;

      return (
        <div className={styles.main} data-testid="error-fallback-ui">
          {t('error')}
        </div>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
