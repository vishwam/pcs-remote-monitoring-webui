// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { DeviceGroupDropdownContainer as DeviceGroupDropdown } from '../../app/deviceGroupDropdown';
import { ManageDeviceGroupsBtnContainer as ManageDeviceGroupsBtn } from '../../app/manageDeviceGroupsBtn';
import { PageContent, ContextMenu } from 'components/shared';
import { schema, normalize } from 'normalizr';
import update from 'immutability-helper';

import './temp.css';

class Hierarchy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: !!props.data.data
    };
  }

  toggleLevel = () => {
    this.setState({ isOpen: !this.state.isOpen });
    const { data: { id, data }, add } = this.props;
    if (!data) add(id);
  };

  render() {
    const { data: { id, data }, add, selector } = this.props;
    return (
      <div className="hierarchy-level">
        <div className="hierarchy-name" onClick={this.toggleLevel}>
          {id} <span>[{ this.state.isOpen ? '-' : '+' }]</span>
        </div>
        {
          this.state.isOpen && data
            ? data.map(dataId =>
                <Hierarchy
                  data={selector(dataId)}
                  add={add}
                  selector={selector}
                  key={dataId} />
              )
            : null
        }
      </div>
    );
  }
}

let dataCnt = 0;
const newData = () => ({
  id: `Label-${dataCnt++}`
})

const newDataGroup = () => {
  const arr = [];
  const max = Math.ceil(Math.random() * 5);
  for (var i = 0; i < max; i++) arr.push(newData());
  return arr;
};

const dataSchema = new schema.Entity('data');
const dataListSchema = new schema.Array(dataSchema);

export class Temp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      entitites: {
        root: { id: 'root' }
      }
    };
  }

  getDataById = (id) => this.state.entitites[id];

  createData = (id) => {
    if (!this.getDataById(id).data) {
      const newData = newDataGroup();
      const { entities: { data }, result } = normalize(newData, dataListSchema);
      this.setState(update(this.state, {
        entitites: {
          $merge: data || {},
          [id]: {
            data: { $set: result }
          }
        }
      }));
    }
  }

  render() {
    return [
      <ContextMenu key="context-menu">
        <DeviceGroupDropdown />
        <ManageDeviceGroupsBtn />
      </ContextMenu>,
      <PageContent className="temp-container" key="page-content">
        <Hierarchy
          data={this.getDataById('root')}
          add={this.createData}
          selector={this.getDataById} />
      </PageContent>
    ];
  }
}
