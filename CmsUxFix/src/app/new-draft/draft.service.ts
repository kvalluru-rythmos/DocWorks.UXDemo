import { Injectable, Injector } from '@angular/core';
import { HttpService } from '../common/http.service';
import { environment } from '../../environments/environment';
import * as _ from 'underscore';
import { LocalEventEmitterService } from '../common/local-event-emitter.service';
import { AuthoringCacheService } from '../common/authoring-cache.service';

@Injectable()
export class DraftService {
    constructor(private httpService: HttpService, public injector: Injector, private authoringCacheService: AuthoringCacheService, public localEventEmitterService: LocalEventEmitterService) {
    }

    getDraftList(nodeId) {
        return {
            data: this.authoringCacheService.getDrafts(nodeId),
            responseObservable: this.httpService.get(environment.API_BASE_URL + '/api/nodes/' + nodeId + '/drafts')
        };
    }

    getCachedDrafts(nodeId) {
        return this.authoringCacheService.getDrafts(nodeId);
    }

    setDraftsToCache(nodeId, value) {
        return this.authoringCacheService.setDrafts(nodeId, value);
    }

    setDraftIdToCache(draftId, isLeft) {
        if (isLeft) {
            this.authoringCacheService.selectedLeftDraftId = draftId;
        } else {
            this.authoringCacheService.selectedRightDraftId = draftId;
        }
    }

    newDraft(draft): Promise<string> {
        return this.httpService.post(environment.API_BASE_URL + '/api/Drafts', draft).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    getDraftHistory(draftId, pageSize, pageNumber): Promise<string> {
        return this.httpService.get(environment.API_BASE_URL + '/api/Drafts/' + draftId + '/GetDraftHistory?pageSize=' + pageSize + '&pageNumber=' + pageNumber).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    createDraftFromSnapshot(draft): Promise<string> {
        return this.httpService.post(environment.API_BASE_URL + '/api/Drafts/createdraftwithsnapshot', draft).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    createDraftUsingMergeContent(draft): Promise<string> {
        return this.httpService.post(environment.API_BASE_URL + '/api/drafts/createdraftwithcontent', draft).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    getSnapshotContent(snapshotId) {
        return this.httpService.get(environment.API_BASE_URL + '/api/DraftSnapshots/' + snapshotId).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    deleteDraft(draftId: string): Promise<string> {
        return this.httpService.delete(environment.API_BASE_URL + '/api/Drafts/' + draftId + '/DeleteDraft').toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    renameDraft(requestModel: any) {
        return this.httpService.put(environment.API_BASE_URL + '/api/drafts', requestModel).toPromise().then(response => {
            return response.json().responseId;
        });
    }

    draftNameExists(selectedDraft, nodeDrafts) {
        const foundDraft = _.find(nodeDrafts, function (draft) { return draft.draftName.toLowerCase() === selectedDraft.draftName.toLowerCase() && draft.draftId !== selectedDraft.draftId; });
        return foundDraft ? true : false;
    }
}
