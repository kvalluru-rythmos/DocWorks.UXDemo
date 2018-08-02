import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from '../common/http.service';
import { LocalEventEmitterService } from '../common/local-event-emitter.service';
import { UserService } from '../common/user.service';

@Injectable()
export class ProfileService {

    constructor(private userService: UserService, private httpService: HttpService, public localEventEmitterService: LocalEventEmitterService) {
    }

    uploadUserProfilePic(value) {
        return this.httpService.post(environment.API_BASE_URL + '/api/UserProfile/UploadUserProfilePic', value).toPromise().then(response => {
            return response.json().responseId;
        });
    }

    removeUserProfilePic() {
        return this.httpService.delete(environment.API_BASE_URL + '/api/UserProfile/DeleteUserProfilePic').toPromise().then(response => {
            return response.json().responseId as string;
        });
    }
}
