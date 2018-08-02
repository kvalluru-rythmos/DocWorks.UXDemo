import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';
import { environment } from '../../environments/environment';

@Injectable()
export class MediaService {

  constructor(private httpService: HttpService) { }

  getAsset(id): Promise<any> {
    return this.httpService.get(environment.API_BASE_URL + '/api/assets/' + id).toPromise().then(response => {
      return response.json().responseId as string;
    });
  }

  getAssets(querystring): Promise<any> {
    return this.httpService.get(environment.API_BASE_URL + '/api/assets/search?' + querystring).toPromise().then(response => {
      return response.json().responseId as string;
    });
  }

  uploadAsset(asset): Promise<any> {
    if (asset.assetId) {
      return this.httpService.put(environment.API_BASE_URL + '/api/assets/', asset).toPromise().then(response => {
        return response.json().responseId as string;
      });
    } else {
      return this.httpService.post(environment.API_BASE_URL + '/api/assets/', asset).toPromise().then(response => {
        return response.json().responseId as string;
      });
    }
  }

  updateAssetProperties(asset): Promise<any> {
    return this.httpService.put(environment.API_BASE_URL + '/api/assets/UpdateAssetProperties/', asset).toPromise().then(response => {
      return response.json().responseId as string;
    });
  }
}
