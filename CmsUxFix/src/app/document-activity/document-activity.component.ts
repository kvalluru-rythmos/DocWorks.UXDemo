import { Component, OnInit, Injector } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { actions, applicationConstants } from '../constants';
import { environment } from '../../environments/environment';
import { DocumentActivityService } from './document-activity.service';
import { TemplateService } from '../common/template.service';
import { BaseComponent } from '../base.component';
import * as _ from 'underscore';
import { TreeViewService } from '../treeview/treeview.service';
import { utils } from '../common/utils';

@Component({
  selector: 'app-document-activity',
  templateUrl: './document-activity.component.html',
  providers: [DocumentActivityService, TemplateService]
})
export class DocumentActivityComponent extends BaseComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public injector: Injector, private treeviewService: TreeViewService,
    private documentActivityService: DocumentActivityService, private templateService: TemplateService) {
    super(injector, { title: undefined } as any);
    this.createSearchForm();
  }

  actionList = actions;
  documentActivityList = [];
  pageNumber = 1;
  pageSize = environment.pageSize;
  isDocumentActivityInProgress: boolean;
  selectedNodeId: string;
  searchForm: FormGroup;
  searchText = new FormControl('');
  Actions = new FormControl('');
  searchDate = new FormControl('');
  users = new FormControl('');
  subscriptionEpoc: any;

  ngOnInit() {
    this.selectedNodeId = this.treeviewService.getSelectedNodeId();
  }

  subscribeUpdates() {
    this.unsubscribeUpdates();
    this.subscriptionEpoc = Math.round(new Date().getTime() / 1000);
    this.notificationService.subscribeTopicWithQuery('DocumentActivity_' + this.selectedNodeId.toString(), 'updatedTimeInEpoch', '>', this.subscriptionEpoc, 'documentActivityEvent');
  }

  unsubscribeUpdates() {
    if (this.subscriptionEpoc) {
      this.notificationService.unsubscribeTopic({ subscriptionTopic: this.subscriptionEpoc, eventName: 'documentActivityEvent' });
    }
  }

  documentActivityEvent(notification) {
    const isTop = notification.isTop;
    if (isTop) {
      this.subscribeUpdates();
      _.each(notification.data, function (value) {
        this.constructTemplateData([value.documentActivityContent], isTop);
      }.bind(this));
    }
  }

  constructTemplateData(documentActivityList, isTopRecord) {
    const totalRecordCount = documentActivityList ? documentActivityList.length : 0;
    _.each(documentActivityList, function (activity, index) {
      let templateId = 'documentActivity.' + activity.documentOperation.toString();
      let replaceableText;
      if (templateId) {
        if (activity.resourceType && this.templateService[activity.resourceType + 'Resolver']) {
          replaceableText = this.templateService[activity.resourceType + 'Resolver'](activity.resourceChange);
        }
        let data = activity.resourceChange ? activity.resourceChange : {};
        data.userName = activity.userName;
        data[activity.resourceType.toLowerCase()] = replaceableText;
        activity.activityString = this.templateService.getTemplateString(templateId, data);
        if (isTopRecord) {
          this.documentActivityList.push(activity);
        } else {
          this.documentActivityList.push(activity);
          this.lastRecordId = (index + 1) === totalRecordCount ? activity.documentActivityId : this.lastRecordId;
        }
      }
    }.bind(this));
    const documentActivities = _.uniq(this.documentActivityList, false, function (value) { return value.createdDate; });
    this.documentActivityList = new utils().clone(documentActivities);
  }

  nodeSelectedEvent(data) {
    if (this.selectedNodeId !== data.value) {
      this.selectedNodeId = data.value;
      this.documentActivityList = [];
      this.resetDocumentActivity();
    }
  }


  closeSideNav() {
    this.emitLocalEvent({ eventName: 'toggleDocumentHistorySideNav', value: false });
  }

  getDocumentActivityList() {
    this.isDocumentActivityInProgress = true;
    const searchDate = this.searchDate.value ? this.searchDate.value.toLocaleDateString() : '';
    this.documentActivityService.getDocumentActivity(this.selectedNodeId, this.pageSize, this.pageNumber, this.searchText.value, this.Actions.value.toString(), this.users.value.toString(), searchDate).then(responseId => {
      this.subscribeForResponse({
        subscriptionTopic: responseId,
        operation: applicationConstants.operation.getDocumentActivity
      });
    });
  }

  getDocumentActivityEvent(notification) {
    this.isDocumentActivityInProgress = false;
    this.constructTemplateData(notification.data.content.documentActivityList, false);
  }


  onScrollDown() {
    this.getDocumentActivityList();
  }

  resetDocumentActivity() {
    this.pageNumber = 1;
    this.documentActivityList = [];
    this.getDocumentActivityList();
    this.subscribeUpdates();
  }

  createSearchForm() {
    this.searchForm = this.formBuilder.group({
      searchText: this.searchText,
      users: this.users,
      actions: this.Actions,
      searchDate: this.searchDate
    });
  }

}
