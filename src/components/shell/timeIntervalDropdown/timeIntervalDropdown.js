// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import * as classnames from 'classnames/bind';
import { SelectInput } from '@microsoft/azure-iot-ux-fluent-controls/lib/components/Input/SelectInput';

import { Select } from 'components/shared';
import { isFunc } from 'utilities';

const cx = classnames.bind(require('./timeIntervalDropdown.scss'));

const optionValues = [
  { value: 'PT1H' },
  { value: 'P1D' },
  { value: 'P7D' },
  { value: 'P1M' },
];

export class TimeIntervalDropdown extends Component {

  onChange = (propOnChange) => (value) => {
    if (isFunc(propOnChange)) propOnChange(value);
  }

  render() {
    const options = optionValues.map(({ value }) => ({
      label: this.props.t(`timeInterval.${value}`),
      value
    }));
    return (
      <SelectInput
        name='time-interval-dropdown'
        className={cx('time-interval-dropdown')}
        attr={{
          select: {
            className: cx('time-interval-dropdown-select'),
          },
          chevron: {
            className: cx('time-interval-dropdown-chevron'),
          },
        }}
        options={options}
        value={this.props.value}
        onChange={this.onChange(this.props.onChange)} />
    );
  }
}
