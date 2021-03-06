// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { permissions, toDiagnosticsModel } from 'services/models';
import { Protected, ProtectedError } from 'components/shared';
import { RuleEditorContainer } from './ruleEditor';
import Flyout from 'components/shared/flyout';

export class EditRuleFlyout extends Component {

  onTopXClose = () => {
    const { logEvent, onClose } = this.props;
    logEvent(toDiagnosticsModel('Rule_TopXCloseClick', {}));
    onClose();
  }

  render() {
    const { onClose, t, rule } = this.props;
    return (
      <Flyout.Container header={t('rules.flyouts.editRule')} onClose={this.onTopXClose}>
          <Protected permission={permissions.updateRules}>{
            (hasPermission, permission) =>
              hasPermission
                ? <RuleEditorContainer onClose={onClose} rule={rule} />
                :
                <div>
                  <ProtectedError t={t} permission={permission} />
                  <p>A read-only view will be added soon as part of another PBI.</p>
                </div>
          }
          </Protected>
      </Flyout.Container>
    );
  }
}
