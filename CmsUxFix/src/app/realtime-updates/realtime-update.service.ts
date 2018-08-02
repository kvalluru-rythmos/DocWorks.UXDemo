import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';
import { environment } from '../../environments/environment';

@Injectable()
export class RealtimeUpdateService {

  constructor(private httpService: HttpService) { }

  getRealTimeUpdates(lastRecordId, pageSize) {
    return { data: undefined, responseObservable: this.getRealTimeUpdateList(lastRecordId, pageSize) };
  }

  getRealTimeUpdateList(lastRecordId, pageSize) {
    return this.httpService.get(environment.API_BASE_URL + '/api/RealtimeUpdate?LastRecordIdinPaging=' + lastRecordId + '&PageSize=' + pageSize);
  }
}
