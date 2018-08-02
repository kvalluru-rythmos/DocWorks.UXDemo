import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AnalyticsService {

  constructor(private httpService: HttpService) { }

  getServices(): Promise<any> {
    return this.httpService.get(environment.API_BASE_URL + '/api/StaticFields/Services')
      .toPromise().then(response => {
        return response.json();
      });
  }

  getEvents(): Promise<any> {
    return this.httpService.get(environment.API_BASE_URL + '/api/StaticFields/Events')
      .toPromise().then(response => {
        return response.json();
      });
  }

  getOperations(): Promise<any> {
    return this.httpService.get(environment.API_BASE_URL + '/api/StaticFields/Operations')
      .toPromise().then(response => {
        return response.json();
      });
  }

  getUserList(): Promise<any> {
    return this.httpService.get(environment.API_BASE_URL + '/api/Users')
      .toPromise().then(response => {
        return response.json().responseId;
      });
  }

  getAccessExecutionMetrics(value) {
    return this.httpService.post(environment.API_BASE_URL + '/api/getAccessExecutionMetrics', value)
      .toPromise().then(response => {
        return response.json().responseId;
      });
  }

  getCacheMetrics(value) {
    return this.httpService.post(environment.API_BASE_URL + '/api/getCacheMetrics', value)
      .toPromise().then(response => {
        return response.json().responseId;
      });
  }

  getSuccessFailureMetrics(value) {
    return this.httpService.post(environment.API_BASE_URL + '/api/getSuccessFailureMetrics', value)
      .toPromise().then(response => {
        return response.json().responseId;
      });
  }

}
