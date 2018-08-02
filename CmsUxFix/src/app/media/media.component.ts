import { Component, OnInit, Injector } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { MediaService } from './media.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Asset } from './asset';
import { applicationConstants, assetTags, cmsOperation, eventStatus, topics } from '../constants';
import { Operation } from '../operation-status/operation';
import { BaseComponent } from '../base.component';
import * as _ from 'underscore';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  providers: [MediaService]
})
export class MediaComponent extends BaseComponent implements OnInit {
  assetArray = [];
  assetType = applicationConstants.assetType.image;
  constAssetType = applicationConstants.assetType;
  filterQuery = applicationConstants.assetViewType.recentAssets;
  assetDetail: Asset = new Asset();
  isLoading = false;
  isAssetDetailLoading = false;
  isEditProperties = false;
  isUpdateInProgress = false;
  isAssetUploadInProgress: any;
  isAssetReplaceInProgress: any;
  selectedAssetId: any;
  copyToClipboardText: any;
  isValueCopied: boolean;
  pageNumber = 1;
  filterType = applicationConstants.filterType.ByText;
  pageSize = environment.pageSize;
  dragDropComponentViewType = applicationConstants.dragDropComponentViewType;
  isAssetAdded: boolean;

  assetSearchForm: FormGroup;
  searchText = new FormControl('');
  searchType = new FormControl('');

  constructor(public injector: Injector, public mediaService: MediaService,
    public formBuilder: FormBuilder) {
    super(injector, { title: undefined } as any);
    this.createSearchForm();
  }

  ngOnInit() {
    this.subscribeTabs();
    this.isAssetAdded = false;
  }

  createSearchForm() {
    this.assetSearchForm = this.formBuilder.group({
      searchText: this.searchText,
      searchType: this.searchType
    });
  }

  subscribeTabs() {
    this.unsubscribe();
    this.topic = [{ value: topics.Asset + '/' + this.assetType, subscriptionTopic: topics.Asset + '/' + this.assetType, eventName: 'assetChangeEvent' }];
    this.subscribeTopic();
    this.searchAsset();
  }

  assetChangeEvent() {
    this.isAssetAdded = true;
  }

  searchAsset() {
    if (!this.assetSearchForm.value.searchText) {
      this.filterType = applicationConstants.filterType.ByText;
    }
    this.pageNumber = 1;
    this.assetArray = [];
    this.assetDetail = new Asset();
    this.selectedAssetId = undefined;
    this.copyToClipboardText = '';
    this.getAllAssets();
  }

  changeAssetType(event: MatTabChangeEvent) {
    this.isLoading = false;
    this.assetType = event.index === 0 ? applicationConstants.assetType.image : event.index === 1 ? applicationConstants.assetType.codeSnippet : applicationConstants.assetType.binary;
    this.subscribeTabs();
  }

  filterAsset(event: MatTabChangeEvent) {
    this.filterQuery = event.index === 0 ? applicationConstants.assetViewType.recentAssets : applicationConstants.assetViewType.myAssets;
    this.searchAsset();
  }

  getAllAssets() {
    this.isAssetAdded = false;
    if (!this.isLoading) {
      this.isLoading = true;
      const querystring = 'AssetType=' + this.assetType + '&AssetView=' + this.filterQuery + '&FilterType=' + this.filterType + '&SearchText=' + this.assetSearchForm.value.searchText + '&PageNumber=' + this.pageNumber + '&SortByField=UploadedDate&PageSize=' + this.pageSize + '&SortOrder=0';
      this.mediaService.getAssets(querystring).then(responseId => {
        this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.searchAssets });
      }, error => {
        this.isLoading = false;
      });
    }
  }

  searchAssetsEvent(notification) {

    if (notification.data.content && (notification.data.content.assetType === this.assetType && notification.data.content.assetView === this.filterQuery) && notification.data.content.assetsList && notification.data.content.assetsList.length > 0) {
      this.isLoading = false;
      this.pageNumber++;
      if (this.assetArray && this.assetArray.length > 0) {
        _.each(notification.data.content.assetsList, function (asset) {
          this.assetArray.push(asset);
        }.bind(this));
      } else {
        this.assetArray = notification.data.content.assetsList;
      }
      if (this.assetArray && this.assetArray.length > 0 && !this.selectedAssetId) {
        this.getAssetProperties(this.assetArray[0]);
        this.selectedAssetId = this.assetArray[0].assetId;
      }
    }
  }

  getAssetProperties(asset) {
    this.getAssetById(asset.assetId);
  }

  getAssetById(id) {
    this.copyToClipboardText = '';
    this.unsubscribe();
    this.topic = [
      { value: topics.Asset + '/' + this.assetType, subscriptionTopic: topics.Asset + '/' + this.assetType, eventName: 'assetChangeEvent' },
      { value: topics.Asset + '/' + id, subscriptionTopic: topics.Asset + '/' + id, eventName: 'assetChangeEvent' }
    ];
    this.subscribeTopic();

    this.isAssetDetailLoading = true;
    this.assetDetail = new Asset();
    this.mediaService.getAsset(id).then(responseId => {
      this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.getAsset });
    }, error => {
      this.isAssetDetailLoading = false;
    });
  }

  getAssetEvent(notification) {
    this.isEditProperties = false;
    this.isAssetDetailLoading = false;
    this.isUpdateInProgress = false;
    this.copyToClipboardText = undefined;
    this.isValueCopied = false;
    if (notification.data.content.assetType === this.assetType) {
      this.assetDetail = notification.data.content;
      if (this.assetDetail.assetType.toString() === applicationConstants.assetType.codeSnippet.toString()) {
        this.assetDetail.assetContent = this.assetDetail.assetContent;
        this.copyToClipboardText = assetTags.assetCodeStart + this.assetDetail.assetId + assetTags.assetCodeEnd;
      } else {
        this.copyToClipboardText = assetTags.assetImageStart + this.assetDetail.assetId + assetTags.assetImageEnd;
      }
    }
  }

  updateAssetData() {
    if (this.isEditProperties) {
      this.isUpdateInProgress = true;
      this.mediaService.updateAssetProperties(this.assetDetail).then(responseId => {
        this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.updateAssetProperties });
        const operation = new Operation(
          responseId,
          cmsOperation.UpdateAssetProperties,
          eventStatus.Wait,
          { fileName: this.assetDetail.fileName });
        this.addOperationEvent(operation);
      }, error => {
        this.isUpdateInProgress = false;
      });
    } else {
      this.isEditProperties = !this.isEditProperties;
    }
  }

  updateAssetPropertiesEvent(notification) {
    this.isEditProperties = !this.isEditProperties;
    this.isUpdateInProgress = false;
    if (this.assetDetail.assetId) {
      this.getAssetById(this.assetDetail.assetId);
    }
  }

  upsertAsset(asset) {
    if (asset.assetId) {
      this.isAssetReplaceInProgress = true;
    } else {
      this.isAssetUploadInProgress = true;
    }
    this.mediaService.uploadAsset(asset).then(responseId => {
      this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.upsertAsset });
      const operation = new Operation(responseId, cmsOperation.UpsertAsset, eventStatus.Wait, { assetName: asset.fileName });
      this.addOperationEvent(operation);
      this.isAssetReplaceInProgress = false;
      this.isAssetUploadInProgress = false;
    }, error => {
      this.isAssetReplaceInProgress = false;
      this.isAssetUploadInProgress = false;
    });
  }

  upsertAssetEvent(notification) {
    this.isAssetAdded = true;
    this.isAssetReplaceInProgress = false;
    this.isAssetUploadInProgress = false;
    if (notification.data && this.assetDetail.assetId === notification.data.content.assetId) {
      this.assetDetail = notification.data.content;
      this.isEditProperties = false;
      const updatedAsset = _.find(this.assetArray, function (value) {
        return value.assetId === this.assetDetail.assetId;
      }.bind(this));
      if (updatedAsset) {
        updatedAsset.fileName = this.assetDetail.fileName;
        updatedAsset.fileSize = this.assetDetail.fileSize;
        updatedAsset.assetContent = this.assetDetail.assetContent;
      }
    }
  }

  scrolldown(value) {
    if (value) {
      this.getAllAssets();
    }
  }

}
