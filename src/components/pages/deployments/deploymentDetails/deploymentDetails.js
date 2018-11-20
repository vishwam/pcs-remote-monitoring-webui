// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import {
  permissions,
  toSinglePropertyDiagnosticsModel,
  packagesModel
} from 'services/models';
import {
  AjaxError,
  Btn,
  ComponentArray,
  ContextMenu,
  ContextMenuAlign,
  DeleteModal,
  Indicator,
  PageContent,
  Protected,
  RefreshBar,
  StatSection,
  StatGroup,
  StatProperty,
  StatPropertyPair
} from 'components/shared';
import { TimeRenderer } from 'components/shared/cellRenderers';
import { getPackageTypeTranslation, getConfigTypeTranslation, svgs } from 'utilities';
import { DeploymentDetailsGrid } from './deploymentDetailsGrid/deploymentDetailsGrid';

import "./deploymentDetails.css";

const closedModalState = {
  openModalName: undefined
};

export class DeploymentDetails extends Component {
  constructor(props) {
    super(props);

    this.props.resetDeployedDevices();
    // Set the initial state
    this.state = {
      ...closedModalState,
      pendingCount: undefined,
      deploymentDeleted: false
    };

    this.props.updateCurrentWindow('DeploymentDetails');

    props.fetchDeployment(props.match.params.id);
  }

  componentWillUnmount() {
    this.props.resetDeployedDevices();
  }

  getOpenModal = () => {
    const { t, deleteIsPending, deleteError, deleteItem, logEvent } = this.props;
    if (this.state.openModalName === 'delete-deployment' && this.props.currentDeployment) {
      logEvent(
        toSinglePropertyDiagnosticsModel(
          'DeploymentDetail_DeleteClick',
          'DeploymentId',
          this.props.currentDeployment ? this.props.currentDeployment.id : ''));
      return <DeleteModal
        t={t}
        deleteItem={deleteItem}
        error={deleteError}
        isPending={deleteIsPending}
        itemId={this.props.currentDeployment.id}
        onClose={this.closeModal}
        onDelete={this.onDelete}
        logEvent={logEvent}
        title={this.props.t('deployments.modals.delete.title')}
        deleteInfo={this.props.t(
          'deployments.modals.delete.info',
          { deploymentName: this.props.currentDeployment.name })} />
    }
    return null;
  }

  openModal = (modalName) => () => this.setState({
    openModalName: modalName
  });

  closeModal = () => this.setState(closedModalState);

  onDelete = () => {
    this.closeModal();
    this.props.history.push(`/deployments`)
  }

  render() {
    const {
      t,
      currentDeployment,
      isPending,
      error,
      deployedDevices,
      isDeployedDevicesPending,
      deployedDevicesError,
      fetchDeployment,
      lastUpdated,
      logEvent
    } = this.props;
    const {
      id,
      appliedCount = 0,
      targetedCount = 0,
      succeededCount = 0,
      failedCount = 0,
      pendingCount = 0,
      name,
      priority,
      deviceGroupName,
      createdDateTimeUtc,
      packageType,
      configType,
      packageName,
      customMetrics = {}
    } = currentDeployment;
    const isADMDeployment = packageType === packagesModel.deviceConfiguration;
    const customMetricsExist = Object.keys(customMetrics).length > 0;

    return (
      <ComponentArray>
        {this.getOpenModal()}
        <ContextMenu>
          <ContextMenuAlign>
            <Protected permission={permissions.createDevices}>
              <Btn svg={svgs.trash} onClick={this.openModal('delete-deployment')}>{t('deployments.modals.delete.contextMenuName')}</Btn>
            </Protected>
          </ContextMenuAlign>
        </ContextMenu>
        <PageContent className="deployments-details-container">

          <RefreshBar refresh={() => fetchDeployment(id)} time={lastUpdated} isPending={isPending} t={t} />

          {error && <AjaxError t={t} error={error} />}

          {isPending && <Indicator />}

          {
            !isPending &&
            <div className="deployment-details-summary-container">
              <div className="deployment-details-summary-labels">
                {t('deployments.details.deploymentName')}
              </div>
              <div className="deployment-name">
                {name}
              </div>
              <StatSection>
                <StatGroup className="summary-container-groups">
                  <StatSection className="summary-container-row1">
                    <StatGroup className="summary-container-columns">
                      <StatProperty
                        value={appliedCount}
                        label={t('deployments.details.applied')}
                        size="large" />
                    </StatGroup>
                    <StatGroup className="summary-container-columns">
                      <StatProperty
                        value={failedCount}
                        label={t('deployments.details.failed')}
                        svg={failedCount !== 0 ? svgs.failed : undefined}
                        svgClassName="stat-failed"
                        size="large" />
                    </StatGroup>
                  </StatSection>
                  <StatSection className="summary-container-row2">
                    <StatGroup className="summary-container-columns">
                      <StatProperty
                        value={targetedCount}
                        label={t('deployments.details.targeted')}
                        size="large" />
                    </StatGroup>
                    <StatGroup className="summary-container-columns">
                      <StatProperty
                        className="summary-container-succeeded"
                        value={succeededCount}
                        label={t('deployments.details.succeeded')}
                        size="small" />
                      <StatProperty
                        className="summary-container-pending"
                        value={pendingCount}
                        label={t('deployments.details.pending')}
                        size="small" />
                    </StatGroup>
                  </StatSection>
                </StatGroup>
                {
                  customMetricsExist &&
                  <StatGroup className="summary-container-columns summary-custom-column">
                    <div>
                      {
                        Object.keys(customMetrics).map((customKey) =>
                          <StatProperty
                            className="summary-container-customMetric"
                            value={customMetrics[customKey]}
                            label={customKey}
                            size="small" />
                        )
                      }
                    </div>
                  </StatGroup>
                }
                <StatGroup className="summary-container-groups">
                  <StatSection className="summary-container-row1">
                    <StatGroup className="summary-container-columns">
                      <StatPropertyPair label={t('deployments.details.deviceGroup')} value={deviceGroupName} />
                    </StatGroup>
                    <StatGroup className="summary-container-columns">
                      <StatPropertyPair
                        label={t('deployments.details.packageType')}
                        value={packageType ? getPackageTypeTranslation(packageType, t) : undefined} />
                    </StatGroup>
                    <StatGroup className="summary-container-columns">
                      <StatPropertyPair label={t('deployments.details.priority')} value={priority} />
                    </StatGroup>
                  </StatSection>
                  <StatSection className="summary-container-row2">
                    <StatGroup className="summary-container-columns">
                      <StatPropertyPair
                        label={t('deployments.details.start')}
                        value={TimeRenderer({ value: createdDateTimeUtc })} />
                    </StatGroup>
                    <StatGroup className="summary-container-columns">
                      <StatPropertyPair label={t('deployments.details.package')} value={packageName} />
                    </StatGroup>
                    {
                      isADMDeployment &&
                      <StatGroup className="summary-container-columns">
                        <StatPropertyPair
                          label={t('deployments.details.configType')}
                          value={configType ? getConfigTypeTranslation(configType, t) : undefined} />
                      </StatGroup>
                    }
                  </StatSection>
                </StatGroup>
              </StatSection>
            </div>
          }

          <h4 className="deployment-details-devices-affected">
            {t('deployments.details.devicesAffected')}
          </h4>

          {isDeployedDevicesPending && <Indicator />}

          {
            deployedDevicesError &&
            <AjaxError
              className="deployed-devices-grid-error"
              t={t}
              error={deployedDevicesError} />
          }

          {!isDeployedDevicesPending && <DeploymentDetailsGrid t={t} deployedDevices={deployedDevices} isADMDeployment={isADMDeployment} logEvent={logEvent} />}
        </PageContent>
      </ComponentArray>
    );
  }
}
