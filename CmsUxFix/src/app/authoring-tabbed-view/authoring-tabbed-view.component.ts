import { Component, Input, Output, EventEmitter, OnChanges, Injector, OnDestroy } from '@angular/core';
import { Tab } from './tab';
import { AuthoringTabbedViewService } from './authoring-tabbed-view.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { environment } from '../../environments/environment';
import * as _ from 'underscore';
import { applicationConstants, DraftType } from '../constants';
import { GDocErrorLogComponent } from '../gdoc-error-log/gdoc-error-log.component';
import { MatDialog } from '@angular/material';
import { BaseComponent } from '../base.component';
import { ActivatedRoute } from '@angular/router';
import { ServiceResponse } from '../common/data-promise-response';
import { utils } from '../common/utils';

@Component({
  selector: 'app-authoring-tabbed-view',
  templateUrl: './authoring-tabbed-view.component.html',
})

export class AuthoringTabbedViewComponent extends BaseComponent implements OnChanges, OnDestroy {
  @Input() selectedTabIndex: number;
  @Input() align: string;
  @Input() config: Tab[];
  @Input() nodeDrafts: any;
  @Input() selectedNodeId: string;
  @Output() explandCollapseEvent = new EventEmitter<Object>();
  @Output() nodeDraftChange = new EventEmitter<Object>();
  content;
  currentTab: Tab;
  gDocUrl: any;
  draftsForm: FormGroup;
  draft = new FormControl('');
  timeoutId: any;
  validationErrors: string[] = [];
  showSpinner = true;
  isDraftContentValid = true;
  failedAssets: any;
  isExpanded: boolean;
  selectedDraftId: string;
  timeIntervalId: any;
  ufPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(applicationConstants.ufPreviewUrl);

  constructor(private tabbedViewService: AuthoringTabbedViewService, public injector: Injector, private route: ActivatedRoute,
    private sanitizer: DomSanitizer, private formBuilder: FormBuilder, private dialog: MatDialog) {
    super(injector, { title: undefined } as any);
    this.draftsForm = this.formBuilder.group({
      draft: this.draft
    });
  }

  waitForValidateGdoc() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      if (this.timeIntervalId) {
        clearInterval(this.timeIntervalId);
      }
      if (this.selectedTabIndex === 0) {
        this.validateDraftContent();
        this.setTimeInterval();
      }
    }, environment.gDocRefreshInterval);
  }

  setTimeInterval() {
    this.timeIntervalId = setInterval(() => {
      if (this.selectedTabIndex === 0) {
        this.validateDraftContent();
      }
    }, environment.gDocRefreshInterval);
  }

  ngOnChanges() {
    this.subscribeForRouteParams();
    this.loadAuthoringPane();
    this.populateTabContent();
  }

  subscribeForRouteParams() {
    this.route.params.subscribe(params => {
      if (params.draftId) {
        this.selectedDraftId = params.draftId;
      }
    });
  }

  loadAuthoringPane() {
    if (!this.selectedNodeId) {
      return;
    }
    if (this.nodeDrafts && this.nodeDrafts.length > 0) {
      this.setSelectedDraft();
      this.nodeDraftChange.emit(this.draft.value);
      this.unsubscribe();
      this.topic = {
        value: 'Draft/' + this.draft.value.draftId,
        subscriptionTopic: this.align + 'Draft/' + this.draft.value.draftId,
        eventName: 'validateDraftContentEvent'
      };
      this.subscribeTopic();
    }
  }

  setSelectedDraft() {
    if (this.selectedDraftId) {
      let selectedDraft = _.find(this.nodeDrafts, function (draft) {
        return draft.draftId === this.selectedDraftId;
      }.bind(this));
      if (!selectedDraft) {
        selectedDraft = this.nodeDrafts[0];
      }
      this.draft.setValue(selectedDraft, { onlySelf: true });
    } else if (!this.draft.value) {
      this.draft.setValue(this.nodeDrafts[0], { onlySelf: true });
      this.populateTabContent();
    } else {
      let selectedDraft = _.find(this.nodeDrafts, function (draft) {
        return draft.draftId === this.draft.value['draftId'];
      }.bind(this));
      if (!selectedDraft) {
        selectedDraft = this.nodeDrafts[0];
      }
      this.draft.setValue(selectedDraft, { onlySelf: true });
    }
  }

  onTabChangeEvent(selectedTabIndex) {
    this.selectedTabIndex = selectedTabIndex;
    this.currentTab = this.config[this.selectedTabIndex];
    this.populateTabContent();
  }

  onDraftChange() {
    this.unsubscribe();
    this.topic = {
      value: 'Draft/' + this.draft.value.draftId,
      subscriptionTopic: this.align + 'Draft/' + this.draft.value.draftId,
      eventName: 'validateDraftContentEvent'
    };
    this.subscribeTopic();
    this.nodeDraftChange.emit(this.draft.value);
    this.populateTabContent();
  }

  populateTabContent() {
    this.validationErrors = [];
    this.showSpinner = true;
    this.isDraftContentValid = true;
    this.gDocUrl = '';
    this.content = '';
    this.currentTab = this.config[this.selectedTabIndex];
    if (this.currentTab.contentType === 'GDoc') {
      this.viewGDoc();
    } else if (this.currentTab.contentType === 'history') {
      this.showSpinner = false;
    } else {
      this.getDraftContent(this.draft.value.draftId, this.currentTab.contentType);
    }
  }

  getDraftContent(draftId, contentType) {
    let serviceResponse: ServiceResponse;
    serviceResponse = this.tabbedViewService.getDraftContent(draftId, contentType) as ServiceResponse;
    if (serviceResponse.data && serviceResponse.data.length >= 0) {
      this.bindContent({ content: serviceResponse.data, draftId: draftId, contentType: contentType });
    }
    serviceResponse.responseObservable.toPromise().then(response => {
      this.subscribeForResponse({
        subscriptionTopic: response.json().responseId,
        operation: applicationConstants.operation[contentType]
      });
    });
  }

  mdEvent(response: any) {
    const newValue = response.data.content.draftContent;
    const draftId = response.data.content.draftId;
    const oldValue = this.tabbedViewService.getDraftContentFromCache(draftId, 'md');
    const equals = this.equals(oldValue, newValue);
    if (!equals) {
      this.tabbedViewService.setDraftContent(draftId, 'md', newValue);
      this.bindContent({ content: newValue, draftId: draftId, contentType: 'md' });
    }
  }

  htmlEvent(response) {
    const newValue = response.data.content.contentAsHtml;
    const draftId = response.data.content.draftId;
    const oldValue = this.tabbedViewService.getDraftContentFromCache(draftId, 'html');
    const equals = this.equals(oldValue, newValue);
    if (!equals) {
      this.tabbedViewService.setDraftContent(draftId, 'html', newValue);
      this.bindContent({ content: newValue, draftId: draftId, contentType: 'html' });
    }
  }

  xmlEvent(response) {
    const newValue = response.data.content.contentAsXml;
    const draftId = response.data.content.draftId;
    const oldValue = this.tabbedViewService.getDraftContentFromCache(draftId, 'xml');
    const equals = this.equals(oldValue, newValue);
    if (!equals) {
      this.tabbedViewService.setDraftContent(draftId, 'xml', newValue);
      this.bindContent({ content: newValue, draftId: draftId, contentType: 'xml' });
    }
  }

  bindContent(value) {
    if (this.currentTab.contentType !== 'GDoc' && this.currentTab.contentType !== 'history') {
      this.bindContentToDraftId(value);
    }
  }

  bindContentToDraftId(value) {
    if (this.draft.value.draftId === value.draftId) {
      value.content = this.currentTab.contentType === 'md' || this.currentTab.contentType === 'xml' ? new utils().convertCustomTagsToMDContent(value.content.replace(/(?:\r\n|\r|\n)/g, '<br />')) : value.content;
      this.gDocUrl = '';
      this.showSpinner = false;
      this.content = value.content;
      if (this.currentTab.title === 'preview') {
        this.postMessage(value.content);
      }
    }
  }

  viewGDoc() {
    if (this.nodeDrafts && this.nodeDrafts.length > 0) {
      if (this.draft.value.gDocUrl) {
        this.waitForValidateGdoc();
        this.gDocUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.draft.value.gDocUrl);
        this.content = '';
      } else {
        this.content = 'GDoc is not available for Source Control and Approved Edition Drafts';
        this.gDocUrl = '';
      }
      this.showSpinner = false;
    }
  }

  validateDraftContent() {
    if (this.currentTab.contentType === 'GDoc' && this.draft.value.draftType === DraftType.WorkInProgress) {
      console.log(this.align + 'draft validate call on : ' + new Date());
      this.tabbedViewService.validateDraftContent(this.draft.value.draftId).then(responseId => {
        this.subscribeForResponse({
          subscriptionTopic: responseId,
          operation: applicationConstants.operation.validateDraftContent
        });
      });
    }
  }

  validateDraftContentEvent(notification: any) {
    if (notification.data && notification.data.content) {
      this.isDraftContentValid = notification.data.content.isDraftContentValid === applicationConstants.draftSnapshotValidStatus.Invalid ? false : true;
      this.failedAssets = this.filterFailedAssets(notification);
    } else {
      this.getDraftContentForTab();
    }
  }

  getDraftContentForTab() {
    if (this.currentTab.contentType === 'md' || this.currentTab.contentType === 'html' || this.currentTab.contentType === 'xml') {
      this.getDraftContent(this.draft.value.draftId, this.currentTab.contentType);
    }
  }

  filterFailedAssets(notification: any) {
    const extractedAssets = notification.data.content.extractedAssets;
    return _.filter(extractedAssets, function (asset) {
      if (!asset.isValid) {
        return asset.assetId;
      }
    });
  }

  openGDocErrorDialog() {
    if (this.isDraftContentValid) {
      return;
    } else {
      this.dialog.open(GDocErrorLogComponent, { data: this.failedAssets, width: '800px' });
    }
  }


  resize(e) {
    this.isExpanded = !this.isExpanded;
    this.explandCollapseEvent.emit();
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.timeIntervalId) {
      clearInterval(this.timeIntervalId);
    }
    this.cleanUp();
  }

  postMessage(value) {
    var frame = document.getElementById(this.align + '_uf-preview-iframe');
    if (frame) {
      let doc = frame['contentWindow'];
      doc.postMessage(value, '*');
    }
  }
}
