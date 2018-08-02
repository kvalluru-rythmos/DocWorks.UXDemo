import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';
import { environment } from '../../environments/environment';

@Injectable()
export class PublishService {

  constructor(private httpService: HttpService) { }

  getPublishHistoryQueues(): Promise<string> {
      return this.httpService.get(environment.API_BASE_URL + '/api/Publishing/GetPublishHistory').toPromise().then(response => {
      return response.json().responseId as string;
    });
  }

  publishDistribution(value): Promise<string> {
    return this.httpService.post(environment.API_BASE_URL + '/api/Publishing/PublishDistribution', value).toPromise().then(response => {
      return response.json().responseId as string;
    });
  }

  getNodesForLiveDraftsAfterDistributionPublish(value): Promise<string> {
    return this.httpService.get(environment.API_BASE_URL + '/api/Publishing/GetNodesForLiveDraftsAfterDistributionPublish/' + value).toPromise().then(response => {
      return response.json().responseId as string;
    });
  }

  getDistributionsQueuedForPublish(): Promise<string> {
      return this.httpService.get(environment.API_BASE_URL + '/api/Publishing/GetDistributionsQueuedForPublish').toPromise().then(response => {
      return response.json().responseId as string;
    });
  }

  getNodeListForPublish(nodeList, distributionId): Promise<string> {
      const requestObject = { distributionId: distributionId, selectedNodeIdList: nodeList };
      return this.httpService.post(environment.API_BASE_URL + '/api/Publishing/GetNodeListForPublish', requestObject).toPromise().then(response => {
          return response.json().responseId as string;
      });
  }
}
