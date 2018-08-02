import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from '../common/http.service';

@Injectable()
export class ImportDistributionService {
  matchedNodes: any;
  values: any;
  constructor(private httpService: HttpService) { }

  importDistribution(value): Promise<string> {
    return this.httpService.post(environment.API_BASE_URL + '/api/distributions/importdistribution', value).toPromise().then(response => {
      return response.json().responseId as string;
    });
  }

}
