import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from '../common/http.service';
import { UserService } from '../common/user.service';
import { StorageService } from '../common/storage.service';
import * as _ from 'underscore';

@Injectable()
export class AuthoringViewService {

    constructor(private httpService: HttpService, private userService: UserService, private storageService: StorageService) { }
    pushDraftToLive(draftId: number | string): Promise<string> {
        return this.httpService.post(environment.API_BASE_URL + '/api/Drafts/' + draftId + '/AcceptDraftToLive', { draftId: draftId }).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    addRecentlyViewedDocuments(document) {
        const key = 'recently_viewed_documents_' + this.userService.user.profile.userId;
        let userDocuments = this.storageService.read(key) as any[];
        if (userDocuments) {

            let matchingDocument = _.find(userDocuments, function (userDocument) {
                return userDocument.url === document.url;
            });

            if (matchingDocument) {
                userDocuments = _.filter(userDocuments, function (userDocument) {
                    return userDocument.url !== document.url;
                });
                document.date = new Date();
            }

            userDocuments.unshift(document);
            if (userDocuments.length > environment.recentlyViewedDrafts) {
                userDocuments.pop();
            }
        } else {
            userDocuments = [document];
        }
        this.storageService.write(key, userDocuments);
    }
}
