import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';
import { environment } from '../../environments/environment';

@Injectable()
export class PersonalUpdateService {

  constructor(private httpService: HttpService) { }

  getPersonalUpdates(lastRecordId, pageSize) {
    return this.httpService.get(environment.API_BASE_URL + '/api/RealtimeUpdate?LastRecordIdinPaging=' + lastRecordId + '&PageSize=' + pageSize)
      .toPromise().then(response => {
        return response.json().responseId as string;
      });
  }

}
