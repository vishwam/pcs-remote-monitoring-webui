// Copyright (c) Microsoft. All rights reserved.

import { stringify } from 'query-string';
import Config from 'app.config';
import { HttpClient } from 'utilities/httpClient';
import {
  toActiveAlertsModel,
  toAlertForRuleModel,
  toAlertsForRuleModel,
  toAlertsModel,
  toMessagesModel,
  toRuleModel,
  toRulesModel,
  toStatusModel
} from './models';

const ENDPOINT = Config.serviceUrls.telemetry;

/** Contains methods for calling the telemetry service */
export class TelemetryService {

  /** Returns the status properties for the telemetry service */
  static getStatus() {
    return HttpClient.get(`${ENDPOINT}status`)
      .map(toStatusModel);
  }

  /** Returns a list of rules */
  static getRules(params = {}) {
    return HttpClient.get(`${ENDPOINT}rules?${stringify(params)}`)
      .map(toRulesModel);
  }

  /** creates a new rule */
  static createRule(rule) {
    return HttpClient.post(`${ENDPOINT}rules`, rule)
      .map(toRuleModel);
  }

  /** updates an existing rule */
  static updateRule(id, rule) {
    return HttpClient.put(`${ENDPOINT}rules/${id}`, rule)
      .map(toRuleModel);
  }

  /** Returns a list of alarms (all statuses) */
  static getAlerts(params = {}) {
    return this.getOrPost(`${ENDPOINT}alarms`, params, toAlertsModel);
  }

  /** Returns a list of active alarms (open or ack) */
  static getActiveAlerts(params = {}) {
    return this.getOrPost(`${ENDPOINT}alarmsbyrule`, params, toActiveAlertsModel);
  }

  /** Returns a list of alarms created from a given rule */
  static getAlertsForRule(id, params = {}) {
    return this.getOrPost(`${ENDPOINT}alarmsbyrule/${id}`, params, toAlertsForRuleModel);
  }

  /** Returns a list of alarms created from a given rule */
  static updateAlertStatus(id, Status) {
    return HttpClient.patch(`${ENDPOINT}alarms/${encodeURIComponent(id)}`, { Status })
      .map(toAlertForRuleModel);
  }

  static deleteAlerts(ids) {
    const request = { Items: ids };
    return HttpClient.post(`${ENDPOINT}alarms!delete`, request);
  }

  /** Returns a telemetry events */
  static getTelemetryByMessages(params = {}) {
    const devicesArr = params.devices || [];
    const _params = {
      ...params,
      devices: (devicesArr).map(encodeURIComponent).join()
    };
    return this.getOrPost(`${ENDPOINT}messages`, _params, toMessagesModel, devicesArr);
  }

  static getTelemetryByDeviceIdP1M(devices = []) {
    return TelemetryService.getTelemetryByMessages({
      from: 'NOW-PT1M',
      to: 'NOW',
      order: 'desc',
      devices
    });
  }

  static getTelemetryByDeviceIdP15M(devices = []) {
    return TelemetryService.getTelemetryByMessages({
      from: 'NOW-PT15M',
      to: 'NOW',
      order: 'desc',
      devices
    });
  }

  static deleteRule(id) {
    return HttpClient.delete(`${ENDPOINT}rules/${id}`)
      .map(() => ({ deletedRuleId: id }));
  }

  static getOrPost(url, params, toModel, devicesArr = undefined) {
    const urlWithParams = `${url}?${stringify(params)}`;
    if (urlWithParams.length > 2048) {
      if (devicesArr) {
        params.devices = devicesArr;
      } else if (params.devices && !Array.isArray(params.devices)) {
        params.devices = params.devices.split(",");
      }
      return HttpClient.post(url, params)
        .map(toModel);
    } else {
      return HttpClient.get(urlWithParams)
        .map(toModel)
    }
  }

}
