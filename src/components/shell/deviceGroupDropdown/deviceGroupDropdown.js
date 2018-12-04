// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import * as classnames from 'classnames/bind';
import { SelectInput } from '@microsoft/azure-iot-ux-fluent-controls/lib/components/Input/SelectInput';

const cx = classnames.bind(require('./deviceGroupDropdown.scss'));

export class DeviceGroupDropdown extends Component {

  onChange = (deviceGroupIds) => (value) => {
    // Don't try to update the device group if the device id doesn't exist
    if (deviceGroupIds.indexOf(value) > -1) {
      this.props.changeDeviceGroup(value);
    }
  }

  deviceGroupsToOptions = deviceGroups => deviceGroups
    .map(({ id, displayName }) => ({ label: displayName, value: id }));

  render() {
    const { deviceGroups, activeDeviceGroupId } = this.props;
    const deviceGroupIds = deviceGroups.map(({ id }) => id);
    return (
      <SelectInput
        name='device-group-dropdown'
        className={cx('device-group-dropdown')}
        attr={{
          select: {
            className: cx('device-group-dropdown-select'),
          },
          chevron: {
            className: cx('device-group-dropdown-chevron'),
          },
        }}
        options={this.deviceGroupsToOptions(deviceGroups)}
        value={activeDeviceGroupId}
        onChange={this.onChange(deviceGroupIds)} />
    );
  }
}
