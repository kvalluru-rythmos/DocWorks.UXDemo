import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from '../common/http.service';

@Injectable()
export class DocumentActivityService {

    constructor(private httpService: HttpService) { }

    getDocumentActivity(nodeId, pageSize, pageNumber, searchText, actions, users, searchDate): Promise<string> {
        return this.httpService.get(environment.API_BASE_URL + '/api/Nodes/' + nodeId + '/GetDocumentActivity?pageSize=' + pageSize + '&pageNumber=' + pageNumber + '&searchText=' + searchText + '&Actions=' + actions + '&createdDate=' + searchDate).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }
}
