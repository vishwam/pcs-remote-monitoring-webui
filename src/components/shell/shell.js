// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Route, Redirect, Switch, NavLink, Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { Shell as FluentShell } from '@microsoft/azure-iot-ux-fluent-controls/lib/components/Shell';

// App Components
import Config from 'app.config';
import Main from './main/main';
import { PageNotFoundContainer as PageNotFound } from './pageNotFound'
import { Hyperlink, Svg } from 'components/shared';

import './shell.scss';
import { SettingsContainer } from './flyouts';

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


  helpMenu() {

    const docLinks = [
      {
        translationId: 'header.getStarted',
        url: 'https://docs.microsoft.com/en-us/azure/iot-suite/iot-suite-remote-monitoring-monitor'
      },
      {
        translationId: 'header.documentation',
        url: 'https://docs.microsoft.com/en-us/azure/iot-suite'
      },
      {
        translationId: 'header.sendSuggestion',
        url: 'https://feedback.azure.com/forums/916438-azure-iot-solution-accelerators'
      }
    ];

    return (
      <div className="menu">
      {
        docLinks.map(({ url, translationId }) =>
          <Link key={translationId}
            className="menu-item"
            target="_blank"
            to={url}>
            { this.props.t(translationId) }
          </Link>
        )
      }
    </div>
    );
  }

  render() {
    const { pagesConfig, t, theme, children, denyAccess } = this.props;
    const navigation = this.getNavProps();
    const masthead = {
      branding:'Azure IoT Remote Monitoring',
      navigation,
      className:"app-header",
      toolBarItems:{
        settings: { title: 'settings', content: <SettingsContainer/>, actions: { cancel: { event: undefined, label: 'cancel' } } },
        help: { title: 'help', content: this.helpMenu(), actions: { cancel: { event: undefined, label: 'cancel' } } }
      }
    };

    return (
      <FluentShell theme={theme} isRtl={false} navigation={navigation} masthead={masthead}>
        {
          denyAccess &&
          <div className="app">
            <Main>
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
