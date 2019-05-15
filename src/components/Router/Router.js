//
// App router
//

import React, { memo } from 'react';

import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Connection from '../Connection/Connection.js';
import Intro from '../Intro/Intro.js';
import Auth from '../Auth/Auth.js';
import Cat from '../Cat/Cat.js';

import { history } from '../../configureStore.js';

import './Router.module.scss';

export const ROOT = '/';
export const AUTH = '/auth/';
export const CAT = '/cat/';

const TRANSITION_CLASS = 'fade';
const ENTER_TRANSITION_DURATION = 750;
const EXIT_TRANSITION_DURATION = 75;

export function Router() {
  return (
    <ConnectedRouter history={history}>
      <>
        <Route
          exact
          path={`(${AUTH}|${CAT})`}
          render={({ location }) => {
            // display Connection component on both auth and cat routes
            return <Connection cat={location.pathname === CAT} />;
          }}
        />
        <Route
          render={({ location }) => (
            <TransitionGroup>
              <CSSTransition
                key={location.pathname}
                classNames={TRANSITION_CLASS}
                timeout={{
                  enter: ENTER_TRANSITION_DURATION,
                  exit: EXIT_TRANSITION_DURATION
                }}
              >
                <Switch location={location}>
                  <Route exact path={AUTH} render={() => <Auth />} />
                  <Route exact path={CAT} render={() => <Cat />} />
                  <Route exact path={ROOT} render={() => <Intro />} />
                  <Route render={() => <Intro />} />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          )}
        />
      </>
    </ConnectedRouter>
  );
}

export default memo(Router);
