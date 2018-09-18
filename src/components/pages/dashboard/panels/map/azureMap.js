// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import Config from 'app.config';
import { isFunc } from 'utilities';

import './azureMap.css';

const AzureMaps = window.atlas;

export class AzureMap extends Component {

  componentDidMount() {
    if (!this.map && this.props.theme && this.props.azureMapsKey) {
      this.initializeMap(this.props.theme, this.props.azureMapsKey);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.map && nextProps.theme && nextProps.azureMapsKey) {
      this.initializeMap(nextProps.theme, nextProps.azureMapsKey);
    }
    // When the theme changes, also change the style for the map.
    // If the user manually chose a map style different than the theme,
    // that choice should be honored. Otherwise, use the default style for the theme.
    if (this.map && nextProps.theme !== this.props.theme) {
      if (this.getMapStyle(this.props.theme) === this.map.getStyle().style) {
        this.map.setStyle({style: this.getMapStyle(nextProps.theme)});
      }
    }
  }

  componentWillUnmount() {
    // Clean up the azure map resources on unmount
    if (this.map) this.map.remove();
  }

  shouldComponentUpdate(nextProps) {
    // Component props never result in a dom updates from React
    return false;
  }

  initializeMap(theme, azureMapsKey) {
    this.map = new AzureMaps.Map('map', {
      'subscription-key': azureMapsKey,
      center: Config.mapCenterPosition,
      zoom: 11,
      style: this.getMapStyle(theme)
    });

    var styleSelector = new AzureMaps.control.StyleControl();
    this.map.addControl(styleSelector, {
      position: "top-right"
    });

    var zoomControl = new AzureMaps.control.ZoomControl();
    this.map.addControl(zoomControl, {
      position: "top-right"
    });

    this.map.addEventListener('load', () => {
      if (isFunc(this.props.onMapReady)) {
        this.props.onMapReady(this.map);
      }
    });
  }

  getMapStyle = (theme) => Config.themes[theme].mapStyle;

  render() {
    return <div id="map"></div>;
  }
}
