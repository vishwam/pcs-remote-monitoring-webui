// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Route, Redirect, Switch, NavLink } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { Shell as FluentShell } from '@microsoft/azure-iot-ux-fluent-controls/lib/components/Shell';

// App Components
import Config from 'app.config';
import Header from './header/header';
import Main from './main/main';
import { PageNotFoundContainer as PageNotFound } from './pageNotFound'
import { Hyperlink, Svg } from 'components/shared';

import './shell.scss';

/** The base component for the app shell */
class Shell extends Component {

  constructor(props) {
    super(props);

    this.state = { openFlyout: '', isNavExpanded: true };
  }

  componentDidMount() {
    const { history, registerRouteEvent } = this.props;
    // Initialize listener to inject the route change event into the epic action stream
    history.listen(({ pathname }) => registerRouteEvent(pathname));
  }

  render() {
    const { pagesConfig, crumbsConfig, openSystemSettings, openUserProfile, t, theme, children, denyAccess } = this.props;
    return (
      <FluentShell theme={theme} isRtl={false} navigation={this.getNavProps()}>
        {
          denyAccess &&
          <div className="app">
            <Main>
              <Header crumbsConfig={crumbsConfig} t={t} />
              <div className="access-denied">
                <Trans i18nKey={'accessDenied.message'}>
                  You don't have permissions.
                  <Hyperlink href={Config.contextHelpUrls.accessDenied} target="_blank">{t('accessDenied.learnMore')}</Hyperlink>
                </Trans>
              </div>
            </Main>
          </div>
        }
        {
          (!denyAccess && pagesConfig) &&
          <div className="app">
            <Main>
              <Header crumbsConfig={crumbsConfig} openSystemSettings={openSystemSettings} openUserProfile={openUserProfile} t={t} />
              <Switch>
                <Redirect exact from="/" to={pagesConfig[0].to} />
                {
                  pagesConfig.map(({ to, exact, component }) =>
                    <Route key={to} exact={exact} path={to} component={component} />)
                }
                <Route component={PageNotFound} />
              </Switch>
              {children}
            </Main>
          </div>
        }
      </FluentShell>
    );
  }

  getNavProps() {
    const { pagesConfig, t, denyAccess } = this.props;
    if (denyAccess || !pagesConfig) {
      return null;
    }

    return {
      isExpanded: this.state.isNavExpanded,
      onClick: this.handleGlobalNavToggle,
      children: pagesConfig.map((tabProps, i) => (
        <NavLink key={i} to={tabProps.to} className="global-nav-item" activeClassName="global-nav-item-active">
          <Svg path={tabProps.svg} className="global-nav-item-icon" />
          <div className="global-nav-item-text">{t(tabProps.labelId)}</div>
        </NavLink>
      ))
    };
  }

  handleGlobalNavToggle = (e) => {
    e.stopPropagation();
    this.setState({
        isNavExpanded: !this.state.isNavExpanded
    });
  }
}

export default Shell;
