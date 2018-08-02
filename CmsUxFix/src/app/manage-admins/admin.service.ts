import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AdminService {

    constructor(private httpService: HttpService) { }

    addOrRemoveSystemAdmin(userId: string, addSystemAdmin: boolean) {
        return this.httpService.post(environment.API_BASE_URL + '/api/Users/' + userId + '/AssignOrRemoveSystemAdmin', { isSystemAdmin: addSystemAdmin }).toPromise().then(response => {
            return response.json().responseId;
        });
    }

    addOrRemoveProjectAdmin(userId: string, projectId: string, addProjectAdmin: boolean) {
        return this.httpService.post(environment.API_BASE_URL + '/api/Projects/' + projectId + '/AssignOrRemoveProjectAdmin', { userId: userId, isProjectAdmin: addProjectAdmin }).toPromise().then(response => {
            return response.json().responseId;
        });
    }

    getAssignedSystemAdmins(): Promise<any> {
        return this.httpService.get(environment.API_BASE_URL + '/api/Users/GetSystemAdmin').toPromise().then(response => {
            return response.json().responseId;
        });
    }

    getFilteredUsers(searchString: string): Promise<any> {
        return this.httpService.get(environment.API_BASE_URL + '/api/Users/GetUserDetails?searchText=' + searchString).toPromise().then(response => {
            return response.json().responseId;
        });
    }

    getAssignedProjectAdmins(projectId: string): Promise<any> {
        return this.httpService.get(environment.API_BASE_URL + '/api/Projects/' + projectId + '/GetProjectAdmin').toPromise().then(response => {
            return response.json().responseId;
        });
    }
}
