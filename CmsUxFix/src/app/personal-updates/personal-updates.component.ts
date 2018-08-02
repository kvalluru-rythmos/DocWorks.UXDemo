import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { BaseComponent } from '../base.component';
import { environment } from '../../environments/environment';
import { TemplateService } from '../common/template.service';
import { Subject } from 'rxjs/Subject';
import * as _ from 'underscore';
import { PersonalUpdateService } from './personal-update.service';
import { applicationConstants } from '../constants';

@Component({
  selector: 'app-personal-updates',
  templateUrl: './personal-updates.component.html',
  providers: [PersonalUpdateService, TemplateService]
})
export class PersonalUpdatesComponent extends BaseComponent implements OnInit, OnDestroy {

  personalUpdateList = [];
  isDataLoading: boolean;
  lastRecordId: any;
  pageSize = environment.pageSize;
  subscriptionEpoc: any;
  subscriptionMap: Map<any, any> = new Map<any, any>();
  // this one is demo data
  // once server is ready then UI can remove hard coded values
  updateList = [
    {
      'realtimeUpdateId': '5acc4fcb8bf52a3380a09f48',
      'userId': '5ab35c990ef87210bc0b8a3e',
      'resourceId': '5acc4f918bf52a3380a09f45',
      'firstName': 'Shashi',
      'lastName': 'Kiran',
      'profilePicUrl': 'https://docworksstagingstorage.blob.core.windows.net:443/userprofilepic/Shashi_Kiran_968cc7bf-9c2b-43da-9563-f36c98f7a42b.png',
      'realtimeUpdateOperation': 5,
      'resourceProperties': {
        'draftId': '5acc4f918bf52a3380a09f45',
        'draftName': 'draft11',
        'nodeId': '5ab8cd346c4da614e0c6ab2a',
        'shortTitle': 'ManualVersionszaa',
        'distributionId': '5ab8cce66c4da614e0c6ab26',
        'distributionName': '2018.03',
        'projectId': '5ab3781233c6231f34f9429b',
        'projectName': 'GSKTest'
      },
      'resourceType': 'Draft',
      'resourceChange': {
        'resourceName': 'draft11'
      },
      'createdDate': 1523339211
    },
    {
      'realtimeUpdateId': '5acc46698bf52a3380a09f44',
      'userId': '5ab35c990ef87210bc0b8a3e',
      'resourceId': '5acc465e8bf52a3380a09f43',
      'firstName': 'Shashi',
      'lastName': 'Kiran',
      'profilePicUrl': 'https://docworksstagingstorage.blob.core.windows.net:443/userprofilepic/Shashi_Kiran_968cc7bf-9c2b-43da-9563-f36c98f7a42b.png',
      'realtimeUpdateOperation': 3,
      'resourceProperties': {
        'nodeId': '5acc465e8bf52a3380a09f43',
        'shortTitle': 'node1',
        'distributionId': '5ab8cce66c4da614e0c6ab26',
        'distributionName': '2018.03',
        'projectId': '5ab3781233c6231f34f9429b',
        'projectName': 'GSKTest'
      },
      'resourceType': 'Node',
      'resourceChange': {
        'resourceName': 'node1'
      },
      'createdDate': 1523336809
    },
    {
      'realtimeUpdateId': '5acc3d768bf52a3380a09f42',
      'userId': '5ab4f8d2c36a3728b8e325c4',
      'resourceId': '5acc3c9ea4d50f36b8b8612a',
      'firstName': 'Service',
      'lastName': 'Staging',
      'profilePicUrl': 'https://docworksstagingstorage.blob.core.windows.net:443/userprofilepic/Service_Staging_3038686a-8bf4-4b1d-831e-d68fb6f083ce.jpeg',
      'realtimeUpdateOperation': 2,
      'resourceProperties': {
        'distributionId': '5acc3c9ea4d50f36b8b8612a',
        'distributionName': 'AutoDistributionNameM7YXHZEX',
        'projectId': '5acc3c81a4d50f36b8b86128',
        'projectName': 'AutoCreateProjectNameNSFVB6N0'
      },
      'resourceType': 'Distribution',
      'resourceChange': {
        'resourceName': 'AutoDistributionNameM7YXHZEX'
      },
      'createdDate': 1523334518
    },
    {
      'realtimeUpdateId': '5acc3c96a4d50f36b8b86129',
      'userId': '5ab4f8d2c36a3728b8e325c4',
      'resourceId': '5acc3c81a4d50f36b8b86128',
      'firstName': 'Service',
      'lastName': 'Staging',
      'profilePicUrl': 'https://docworksstagingstorage.blob.core.windows.net:443/userprofilepic/Service_Staging_3038686a-8bf4-4b1d-831e-d68fb6f083ce.jpeg',
      'realtimeUpdateOperation': 1,
      'resourceProperties': {
        'projectId': '5acc3c81a4d50f36b8b86128',
        'projectName': 'AutoCreateProjectNameNSFVB6N0'
      },
      'resourceType': 'Project',
      'resourceChange': {
        'resourceName': 'AutoCreateProjectNameNSFVB6N0'
      },
      'createdDate': 1523334294
    },
    {
      'realtimeUpdateId': '5acc2e3ba4d50f36b8b86127',
      'userId': '5ab395dba247ed14b830e96c',
      'resourceId': '5abd1294caf254274c95fc31',
      'firstName': 'Mark',
      'lastName': 'Dugdale',
      'profilePicUrl': 'https://docworksstagingstorage.blob.core.windows.net:443/userprofilepic/Mark_Dugdale_5241c23b-1bb1-4ab9-b2e0-665b37cfb3fe.png',
      'realtimeUpdateOperation': 12,
      'resourceProperties': {
        'draftId': '5abd1294caf254274c95fc31',
        'draftName': 'asdjbasjda',
        'nodeId': '5abd0127caf254274c95fbfa',
        'shortTitle': 'ManualVersions',
        'distributionId': '5abd0112caf254274c95fbf8',
        'distributionName': '2017.1',
        'projectId': '5abd00dccaf254274c95fbf7',
        'projectName': 'MarkTest2'
      },
      'resourceType': 'Draft',
      'resourceChange': {
        'resourceName': 'asdjbasjda'
      },
      'createdDate': 1523330619
    },
    {
      'realtimeUpdateId': '5acc2825a4d50f36b8b86123',
      'userId': '5ab395dba247ed14b830e96c',
      'resourceId': '5acc27dca4d50f36b8b860ea',
      'firstName': 'Mark',
      'lastName': 'Dugdale',
      'profilePicUrl': 'https://docworksstagingstorage.blob.core.windows.net:443/userprofilepic/Mark_Dugdale_5241c23b-1bb1-4ab9-b2e0-665b37cfb3fe.png',
      'realtimeUpdateOperation': 2,
      'resourceProperties': {
        'distributionId': '5acc27dca4d50f36b8b860ea',
        'distributionName': '2018.3',
        'projectId': '5abd00dccaf254274c95fbf7',
        'projectName': 'MarkTest2'
      },
      'resourceType': 'Distribution',
      'resourceChange': {
        'resourceName': '2018.3'
      },
      'createdDate': 1523329061
    },
    {
      'realtimeUpdateId': '5acc1a01a4d50f36b8b860e9',
      'userId': '5ab395dba247ed14b830e96c',
      'resourceId': '5acc19dda4d50f36b8b860e5',
      'firstName': 'Mark',
      'lastName': 'Dugdale',
      'profilePicUrl': 'https://docworksstagingstorage.blob.core.windows.net:443/userprofilepic/Mark_Dugdale_5241c23b-1bb1-4ab9-b2e0-665b37cfb3fe.png',
      'realtimeUpdateOperation': 5,
      'resourceProperties': {
        'draftId': '5acc19dda4d50f36b8b860e5',
        'draftName': 'Example draft',
        'nodeId': '5acc124ea4d50f36b8b860ac',
        'shortTitle': 'UnityManual',
        'distributionId': '5acc123ca4d50f36b8b860ab',
        'distributionName': '2018.2',
        'projectId': '5abd00dccaf254274c95fbf7',
        'projectName': 'MarkTest2'
      },
      'resourceType': 'Draft',
      'resourceChange': {
        'resourceName': 'Example draft'
      },
      'createdDate': 1523325441
    },
    {
      'realtimeUpdateId': '5acc12c7a4d50f36b8b860e4',
      'userId': '5ab395dba247ed14b830e96c',
      'resourceId': '5acc123ca4d50f36b8b860ab',
      'firstName': 'Mark',
      'lastName': 'Dugdale',
      'profilePicUrl': 'https://docworksstagingstorage.blob.core.windows.net:443/userprofilepic/Mark_Dugdale_5241c23b-1bb1-4ab9-b2e0-665b37cfb3fe.png',
      'realtimeUpdateOperation': 2,
      'resourceProperties': {
        'distributionId': '5acc123ca4d50f36b8b860ab',
        'distributionName': '2018.2',
        'projectId': '5abd00dccaf254274c95fbf7',
        'projectName': 'MarkTest2'
      },
      'resourceType': 'Distribution',
      'resourceChange': {
        'resourceName': '2018.2'
      },
      'createdDate': 1523323591
    },
    {
      'realtimeUpdateId': '5acb9fbc3a172931f42e01bb',
      'userId': '5ab4f8d2c36a3728b8e325c4',
      'resourceId': '5acb9ef33a172931f42e017b',
      'firstName': 'Service',
      'lastName': 'Staging',
      'profilePicUrl': 'https://docworksstagingstorage.blob.core.windows.net:443/userprofilepic/Service_Staging_3038686a-8bf4-4b1d-831e-d68fb6f083ce.jpeg',
      'realtimeUpdateOperation': 2,
      'resourceProperties': {
        'distributionId': '5acb9ef33a172931f42e017b',
        'distributionName': 'AutoDistributionName5FBK0HWE',
        'projectId': '5acb9ed43a172931f42e0179',
        'projectName': 'AutoCreateProjectNameGCG3F6LD'
      },
      'resourceType': 'Distribution',
      'resourceChange': {
        'resourceName': 'AutoDistributionName5FBK0HWE'
      },
      'createdDate': 1523294140
    },
    {
      'realtimeUpdateId': '5acb9eed3a172931f42e017a',
      'userId': '5ab4f8d2c36a3728b8e325c4',
      'resourceId': '5acb9ed43a172931f42e0179',
      'firstName': 'Service',
      'lastName': 'Staging',
      'profilePicUrl': 'https://docworksstagingstorage.blob.core.windows.net:443/userprofilepic/Service_Staging_3038686a-8bf4-4b1d-831e-d68fb6f083ce.jpeg',
      'realtimeUpdateOperation': 1,
      'resourceProperties': {
        'projectId': '5acb9ed43a172931f42e0179',
        'projectName': 'AutoCreateProjectNameGCG3F6LD'
      },
      'resourceType': 'Project',
      'resourceChange': {
        'resourceName': 'AutoCreateProjectNameGCG3F6LD'
      },
      'createdDate': 1523293933
    },
    {
      'realtimeUpdateId': '5acb9a943a172931f42e0138',
      'userId': '5ab4f8d2c36a3728b8e325c4',
      'resourceId': '5acb9a813a172931f42e0137',
      'firstName': 'Service',
      'lastName': 'Staging',
      'profilePicUrl': 'https://docworksstagingstorage.blob.core.windows.net:443/userprofilepic/Service_Staging_3038686a-8bf4-4b1d-831e-d68fb6f083ce.jpeg',
      'realtimeUpdateOperation': 1,
      'resourceProperties': {
        'projectId': '5acb9a813a172931f42e0137',
        'projectName': 'AutoCreateProjectNameV9CZXF9A'
      },
      'resourceType': 'Project',
      'resourceChange': {
        'resourceName': 'AutoCreateProjectNameV9CZXF9A'
      },
      'createdDate': 1523292820
    },
    {
      'realtimeUpdateId': '5acb61933a172931f42e0136',
      'userId': '5ab35c990ef87210bc0b8a3e',
      'resourceId': '5acb60543a172931f42e00f6',
      'firstName': 'Shashi',
      'lastName': 'Kiran',
      'profilePicUrl': 'https://docworksstagingstorage.blob.core.windows.net:443/userprofilepic/Shashi_Kiran_968cc7bf-9c2b-43da-9563-f36c98f7a42b.png',
      'realtimeUpdateOperation': 2,
      'resourceProperties': {
        'distributionId': '5acb60543a172931f42e00f6',
        'distributionName': '2018.04.04',
        'projectId': '5ab3781233c6231f34f9429b',
        'projectName': 'GSKTest'
      },
      'resourceType': 'Distribution',
      'resourceChange': {
        'resourceName': '2018.04.04'
      },
      'createdDate': 1523278227
    },
    {
      'realtimeUpdateId': '5acb5ec73a172931f42e00f4',
      'userId': '5ab35c990ef87210bc0b8a3e',
      'resourceId': '5acb5e813a172931f42e00f0',
      'firstName': 'Shashi',
      'lastName': 'Kiran',
      'profilePicUrl': 'https://docworksstagingstorage.blob.core.windows.net:443/userprofilepic/Shashi_Kiran_968cc7bf-9c2b-43da-9563-f36c98f7a42b.png',
      'realtimeUpdateOperation': 5,
      'resourceProperties': {
        'draftId': '5acb5e813a172931f42e00f0',
        'draftName': 'Draft1',
        'nodeId': '5acb5e393a172931f42e00ee',
        'shortTitle': 'UTest',
        'distributionId': '5ab8cce66c4da614e0c6ab26',
        'distributionName': '2018.03',
        'projectId': '5ab3781233c6231f34f9429b',
        'projectName': 'GSKTest'
      },
      'resourceType': 'Draft',
      'resourceChange': {
        'resourceName': 'Draft1'
      },
      'createdDate': 1523277511
    },
    {
      'realtimeUpdateId': '5acb5e453a172931f42e00ef',
      'userId': '5ab35c990ef87210bc0b8a3e',
      'resourceId': '5acb5e393a172931f42e00ee',
      'firstName': 'Shashi',
      'lastName': 'Kiran',
      'profilePicUrl': 'https://docworksstagingstorage.blob.core.windows.net:443/userprofilepic/Shashi_Kiran_968cc7bf-9c2b-43da-9563-f36c98f7a42b.png',
      'realtimeUpdateOperation': 3,
      'resourceProperties': {
        'nodeId': '5acb5e393a172931f42e00ee',
        'shortTitle': 'UTest',
        'distributionId': '5ab8cce66c4da614e0c6ab26',
        'distributionName': '2018.03',
        'projectId': '5ab3781233c6231f34f9429b',
        'projectName': 'GSKTest'
      },
      'resourceType': 'Node',
      'resourceChange': {
        'resourceName': 'UTest'
      },
      'createdDate': 1523277381
    },
    {
      'realtimeUpdateId': '5acb52d13a172931f42e00ed',
      'userId': '5ab4f8d2c36a3728b8e325c4',
      'resourceId': '5acb52553a172931f42e00ad',
      'firstName': 'Service',
      'lastName': 'Staging',
      'profilePicUrl': 'https://docworksstagingstorage.blob.core.windows.net:443/userprofilepic/Service_Staging_3038686a-8bf4-4b1d-831e-d68fb6f083ce.jpeg',
      'realtimeUpdateOperation': 2,
      'resourceProperties': {
        'distributionId': '5acb52553a172931f42e00ad',
        'distributionName': 'AutoDistributionNameZD1QQRIS',
        'projectId': '5acb52373a172931f42e00ab',
        'projectName': 'AutoCreateProjectNameOFQL0O76'
      },
      'resourceType': 'Distribution',
      'resourceChange': {
        'resourceName': 'AutoDistributionNameZD1QQRIS'
      },
      'createdDate': 1523274449
    }
  ];

  constructor(private personalUpdateService: PersonalUpdateService, public injector: Injector, private templateService: TemplateService) {
    super(injector, { title: undefined } as any);
    this.topic = undefined;
  }

  ngOnInit() {
    this.constructTemplateData(this.updateList, false);
    // this.getPersonalUpdates();
  }

  subscribeUpdates() {
    this.unsubscribeUpdates();
    this.subscriptionEpoc = Math.round(new Date().getTime() / 1000);
    this.subscriptionMap.set(this.subscriptionEpoc, new Subject());
    this.notificationService.subscribeTopicWithQuery('PersonalUpdate', 'updatedTimeInEpoch', '>', this.subscriptionEpoc, 'GetPersonalUpdate');
  }

  getPersonalUpdates() {
    // this.isDataLoading = true;
    this.personalUpdateService.getPersonalUpdates(this.lastRecordId, this.pageSize).then(responseId => {
      this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.getPersonalUpdate });
      this.subscribeUpdates();
    });
  }

  unsubscribeUpdates() {
    if (this.subscriptionMap.get(this.subscriptionEpoc)) {
      this.subscriptionMap.get(this.subscriptionEpoc).next();
      this.subscriptionMap.get(this.subscriptionEpoc).complete();
    }
    this.notificationService.unsubscribeTopic(this.subscriptionEpoc);
  }

  GetPersonalUpdate(notification) {
    this.isDataLoading = false;
    const isTop = notification.isTop;
    if (isTop) {
      _.each(notification.data, function (value) {
        this.constructTemplateData([value.realtimeUpdateContent], isTop);
      }.bind(this));
      this.subscribeUpdates();
    } else {
      this.constructTemplateData(notification.data.content.personalUpdateList, isTop);
    }
  }

  constructTemplateData(personalUpdateList, isTopRecord) {
    const totalRecordCount = personalUpdateList ? personalUpdateList.length : 0;
    _.each(personalUpdateList, function (value, index) {
      const templateId = 'personalUpdates.' + value.realtimeUpdateOperation.toString();
      if (templateId) {
        const data = this.setTemplateData(value);
        value.content = this.templateService.getTemplateString(templateId, data);
        if (isTopRecord) {
          this.personalUpdateList.unshift(value);
        } else {
          this.personalUpdateList.push(value);
          this.lastRecordId = (index + 1) === totalRecordCount ? value.realtimeUpdateId : this.lastRecordId;
        }
      }
    }.bind(this));
  }

  setTemplateData(value) {
    let data = value.resourceChange;
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
    this.getPersonalUpdates();
  }

  ngOnDestroy() {
    this.unsubscribeUpdates();
  }
}
