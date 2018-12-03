// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';
import { SelectInput } from '@microsoft/azure-iot-ux-fluent-controls/lib/components/Input/SelectInput';

import { joinClasses } from 'utilities';

import './styles/select.css';

const onChangeSelect = (onChange, name) => (value) => {
  onChange({ target: { name, value: { value } } });
}

export const Select = ({ className, onChange, name, options, ...props }) => {
  return <SelectInput
    name={name}
    className={joinClasses('select-container', className)}
    options={options || []}
    {...props}
    onChange={onChangeSelect(onChange, name)} />;
};

Select.propTypes = { className: PropTypes.string };
