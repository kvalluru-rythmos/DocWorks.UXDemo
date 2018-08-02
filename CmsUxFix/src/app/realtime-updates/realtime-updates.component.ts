import {Component, OnInit, OnDestroy} from '@angular/core';
import {RealtimeUpdateService} from './realtime-update.service';
import {environment} from '../../environments/environment';
import * as _ from 'underscore';
import {TemplateService} from '../common/template.service';
import {ServiceResponse} from '../common/data-promise-response';
import {SignalrService} from '../common/signalr.service';

@Component({
  selector: 'app-realtime-updates',
  templateUrl: './realtime-updates.component.html',
  providers: [RealtimeUpdateService, TemplateService],
})
export class RealtimeUpdatesComponent implements OnInit, OnDestroy {
  realTimeUpdateList = [];
  isDataLoading: boolean;
  lastRecordId: any;
  pageSize = environment.pageSize;

  startupParameters = {
    reference: this,
    topics: ['RealtimeUpdates'],
    startupRequestCallbacks: [this.getRealtimeUpdates],
    events: [{
      name: 'GotRealtimeUpdates',
      callback: this.realtimeUpdateResponse
    },
      {
        name: 'NewRealtimeUpdate',
        callback: this.newRealtimeUpdate
      }
    ]
  };

  constructor(private realtimeUpdateService: RealtimeUpdateService,
              private templateService: TemplateService, private signalr: SignalrService) {
  }

  ngOnInit() {
    this.signalr.startup(this.constructor.name, this.startupParameters);
  }

  getRealtimeUpdates() {
    this.isDataLoading = true;
    let serviceResponse: ServiceResponse;
    serviceResponse = this.realtimeUpdateService.getRealTimeUpdates(this.lastRecordId, this.pageSize) as ServiceResponse;
    serviceResponse.responseObservable.toPromise().then(response => {
      const responseId = response.json().responseId as string;
    });
  }

  getProfileShortName(value) {
    return (value.firstName ? value.firstName.charAt(0).toString().toUpperCase() : '') + (value.lastName ? value.lastName.charAt(0).toString().toUpperCase() : '');
  }

  realtimeUpdateResponse(notification) {
    this.isDataLoading = false;
    var realtimeUpdates = [];
    if (notification && notification[0]) {
      realtimeUpdates = notification[0].realtimeUpdateList;
    }
    this.constructTemplateData(realtimeUpdates, false);
  }

  newRealtimeUpdate(data) {
    if (!data || !data.content || !data.content.realtimeUpdate) {
      return;
    }
    this.constructTemplateData([data.content.realtimeUpdate], true);
  }

  constructTemplateData(realTimeUpdateList, isTopRecord) {
    const totalRecordCount = realTimeUpdateList ? realTimeUpdateList.length : 0;
    _.each(realTimeUpdateList, function (value, index) {
      const templateId = 'realtimeUpdates.' + value.realtimeUpdateOperation.toString();
      if (templateId) {
        const data = this.setTemplateData(value);
        value.content = this.templateService.getTemplateString(templateId, data);
        if (isTopRecord) {
          this.realTimeUpdateList.unshift(value);
        } else {
          this.realTimeUpdateList.push(value);
          this.lastRecordId = (index + 1) === totalRecordCount ? value.realtimeUpdateId : this.lastRecordId;
        }
      }
    }.bind(this));
  }

  setTemplateData(value) {
    let data;
    data = value.resourceChange;
    data.draftId = value.resourceProperties.draftId;
    data.draftName = value.resourceProperties.draftName;
    data.nodeId = value.resourceProperties.nodeId;
    data.shortTitle = value.resourceProperties.shortTitle;
    data.distributionId = value.resourceProperties.distributionId;
    data.distributionName = value.resourceProperties.distributionName;
    data.projectId = value.resourceProperties.projectId;
    data.projectName = value.resourceProperties.projectName;
    data.userName = value.firstName + ' ' + value.lastName;
    return data;
  }

  onScrollDown() {
    this.getRealtimeUpdates();
  }

  ngOnDestroy() {
    this.signalr.shutdown(this.constructor.name);
  }
}
