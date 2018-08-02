import { Injectable, Injector } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from '../common/http.service';
import { AuthoringCacheService } from '../common/authoring-cache.service';
import { LocalEventEmitterService } from '../common/local-event-emitter.service';

@Injectable()
export class AuthoringTabbedViewService {
    constructor(public injector: Injector, private httpService: HttpService, private authoringCacheService: AuthoringCacheService, public localEventEmitterService: LocalEventEmitterService) {
    }

    getDraftContent(draftId, contentType) {
        return {
            data: this.authoringCacheService.getDraftContent(draftId, contentType),
            responseObservable: this.httpService.get(environment.API_BASE_URL + '/api/Drafts/' + draftId + '/' + contentType)
        };
    }

    getDraftContentFromCache(draftId, contentType) {
        return this.authoringCacheService.getDraftContent(draftId, contentType);
    }

    validateDraftContent(draftId: string): Promise<string> {
        return this.httpService.get(environment.API_BASE_URL + '/api/drafts/' + draftId + '/validate').toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    getAllTags() {
        return {
            data: undefined,
            responseObservable: this.httpService.get(environment.API_BASE_URL + '/api/tags')
        };
    }

    getTabs() {
        const url = environment.API_BASE_URL + '/api/tabs';
        return this.httpService.get(url).toPromise().then(response => {
            return response.json().data as any[];
        });
    }

    getDraftTags(id: number | string) {
        return {
            data: undefined,
            responseObservable: this.httpService.get(environment.API_BASE_URL + '/api/draftTags/' + id)
        };
    }

    updateDraftTags(draftID: number | string, tag: any, operation: string): Promise<string> {
        return this.httpService.get(environment.API_BASE_URL + '/api/updateDraftTags/' + tag.name).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    setDraftContent(draftId: string, contentType: string, fileContent: string) {
        this.authoringCacheService.setDraftContent(draftId, contentType, fileContent);
    }
}
