// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Toggle } from '@microsoft/azure-iot-ux-fluent-controls/lib/components/Toggle';

import Config from 'app.config';
import Flyout from 'components/shared/flyout';
import { Btn, Indicator } from 'components/shared';
import { svgs, LinkedComponent, isDef } from 'utilities';
import ApplicationSettings from './applicationSettings';

import './settings.css';

const Section = Flyout.Section;

export class Settings extends LinkedComponent {

  constructor(props) {
    super(props);

    this.state = {
      desiredSimulationState: this.props.isSimulationEnabled,
      diagnosticsOptIn: this.props.diagnosticsOptIn,
      logoFile: undefined,
      applicationName: '',
      loading: false,
      toggledSimulation: false,
      madeLogoUpdate: false
    };

    const { t } = this.props;

    // Helper objects for choosing the correct label for the simulation service toggle input
    this.desiredSimulationLabel = {
      true: t('settingsFlyout.start'),
      false: t('settingsFlyout.stop')
    };
    this.currSimulationLabel = {
      true: t('settingsFlyout.flowing'),
      false: t('settingsFlyout.stopped')
    };

    this.applicationName = this.linkTo('applicationName')
      .map(value => value.length === 0 ? undefined : value);

    this.props.getSimulationStatus();
  }

  componentWillReceiveProps({
    isSimulationEnabled,
    setLogoPending,
    setLogoError,
    getSimulationPending,
    getSimulationError,
    diagnosticsOptIn
  }) {
    const { madeLogoUpdate, desiredSimulationState } = this.state;
    this.setState({ diagnosticsOptIn: diagnosticsOptIn });
    if (!isDef(desiredSimulationState)
      && isDef(isSimulationEnabled)
      && !getSimulationPending
      && !getSimulationError) {
      this.setState({
        desiredSimulationState: isSimulationEnabled
      });
    }

    if (madeLogoUpdate && !setLogoPending && !setLogoError) {
      this.props.onClose();
    }
  }

  onChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  onSimulationChange = (value) => {
    const etag = this.props.simulationEtag;
    this.setState({
      toggledSimulation: true,
      desiredSimulationState: value
    });
    this.props.toggleSimulationStatus(etag, value);
  }

  toggleDiagnostics = (value) => {
    this.setState(
      { diagnosticsOptIn: value },
      () => this.props.updateDiagnosticsOptIn(value)
    );
  }

  apply = (event) => {
    const { logoFile, applicationName } = this.state;
    if (logoFile || applicationName) {
      var headers = {};
      if (applicationName) {
        headers.name = applicationName
      }
      if (logoFile) {
        headers['Content-Type'] = logoFile.type;
      } else {
        headers['Content-Type'] = "text/plain";
      }
      this.props.updateLogo(logoFile, headers);
      this.setState({
        madeLogoUpdate: true
      });
    }
    event.preventDefault();
  };

  onUpload = (file) => {
    this.setState({
      logoFile: file
    });
  };

  render() {
    const {
      t,
      onClose,
      theme,
      changeTheme,
      version,
      releaseNotesUrl,
      isSimulationEnabled,
      simulationToggleError,
      setLogoError,
      getSimulationPending,
      getSimulationError,
      getDiagnosticsPending,
      getDiagnosticsError
    } = this.props;
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const {
      desiredSimulationState,
      loading,
      logoFile,
      applicationName,
      toggledSimulation,
      madeLogoUpdate
    } = this.state;
    const hasChanged = logoFile !== undefined || applicationName !== '';
    const hasSimulationChanged = !getSimulationPending
      && !getSimulationError
      && (isSimulationEnabled !== desiredSimulationState)
    const simulationLabel = hasSimulationChanged
      ? this.desiredSimulationLabel[desiredSimulationState]
      : this.currSimulationLabel[isSimulationEnabled];

    return (

      <form onSubmit={this.apply}>
        <div>
          <div className="settings-workflow-container">
            <Section.Container collapsable={false}>
              <Section.Header>{t('settingsFlyout.sendDiagnosticsHeader')}</Section.Header>
              <Section.Content className="diagnostics-content">
                {this.props.t('settingsFlyout.sendDiagnosticsText')}
                <a href={Config.serviceUrls.privacy}
                  className="privacy-link"
                  target="_blank" rel="noopener noreferrer">
                  {this.props.t('settingsFlyout.sendDiagnosticsMicrosoftPrivacyUrl')}
                </a>
                {
                  getDiagnosticsError
                    ? <div className="toggle">
                      {t('settingsFlyout.diagnosticsLoadError')}
                    </div>
                    : <div className="toggle">
                      <Toggle
                        name='settings-diagnostics-opt-in'
                        on={this.state.diagnosticsOptIn}
                        disabled={getDiagnosticsPending}
                        onChange={this.toggleDiagnostics}
                        onLabel={t(getDiagnosticsPending ? 'settingsFlyout.loading' : 'settingsFlyout.sendDiagnosticsCheckbox')}
                        offLabel={t(getDiagnosticsPending ? 'settingsFlyout.loading' : 'settingsFlyout.sendDiagnosticsCheckbox')} />
                    </div>
                }
              </Section.Content>
            </Section.Container>
            <Section.Container collapsable={false} className="app-version">
              <Section.Header>{t('settingsFlyout.version', { version })}</Section.Header>
              <Section.Content className="release-notes">
                <a href={releaseNotesUrl} target="_blank" rel="noopener noreferrer">{t('settingsFlyout.viewRelNotes')}</a>
              </Section.Content>
            </Section.Container>
            <Section.Container className="simulation-toggle-container">
              <Section.Header>{t('settingsFlyout.simulationData')} </Section.Header>
              <Section.Content className="simulation-description">
                {t('settingsFlyout.simulationDescription')}
                {
                  getSimulationError
                    ? <div className="simulation-toggle">
                      {t('settingsFlyout.simulationLoadError')}
                    </div>
                    : <div className="simulation-toggle">
                      <Toggle
                        className="simulation-toggle-button"
                        name="desiredSimulationState"
                        on={desiredSimulationState}
                        disabled={getSimulationPending}
                        onChange={this.onSimulationChange}
                        onLabel={getSimulationPending ? t('settingsFlyout.loading') : simulationLabel}
                        offLabel={getSimulationPending ? t('settingsFlyout.loading') : simulationLabel} />
                    </div>
                }
              </Section.Content>
            </Section.Container>
            <Section.Container>
              <Section.Header>{t('settingsFlyout.theme')}</Section.Header>
              <Section.Content>
                {t('settingsFlyout.changeTheme')}
                <button onClick={() => changeTheme(nextTheme)} className="toggle-theme-btn">
                  {t('settingsFlyout.switchTheme', { nextTheme })}
                </button>
              </Section.Content>
            </Section.Container>
            <ApplicationSettings
              onUpload={this.onUpload}
              applicationNameLink={this.applicationName}
              {...this.props} />
            {
              (toggledSimulation && simulationToggleError) &&
              <div className="toggle-error">
                {t('settingsFlyout.toggleError')}
              </div>
            }
            {
              (madeLogoUpdate && setLogoError) &&
              <div className="set-logo-error">
                {t('settingsFlyout.setLogoError')}
              </div>
            }
            <div className="btn-container">
              {
                !loading && hasChanged &&
                <Btn type="submit" className="apply-button">{t('settingsFlyout.apply')}</Btn>
              }
              <Btn svg={svgs.x} onClick={onClose} className="close-button">
                {hasChanged ? t('settingsFlyout.cancel') : t('settingsFlyout.close')}</Btn>
              {loading && <Indicator size='small' />}
            </div>
          </div>
        </div>
      </form>
    );
  }
}
