import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { BaseComponent } from '../base.component';
import { topics, applicationConstants } from '../constants';
import { TagCacheService } from '../tags/tag-cache.service';
import { ServiceResponse } from '../common/data-promise-response';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html'
})
export class MainComponent extends BaseComponent implements OnInit {

    @ViewChild('sidenav') public sidenav: MatSidenav;
    constructor(public injector: Injector, private tagCacheService: TagCacheService) {
        super(injector, { title: undefined } as any);
        this.topic = { value: topics.Dashboard, subscriptionTopic: topics.Dashboard, eventName: 'refreshProjectAndTagGroupEvent' };
        this.subscribeTopic();
    }

    openNotificationSideNav(data) {
        if (data) {
            this.sidenav.open();
        } else {
            this.sidenav.close();
        }
    }

    ngOnInit() {
        this.getTagGroupList();
    }

    refreshProjectAndTagGroupEvent() {
        this.getTagGroupList();
    }

    getAllTagGroupsAndTagsEvent(response) {
        const newValue = response.data.content.tagGroups;
        const oldValue = this.tagCacheService.getTagGroups();
        const equals = this.equals(oldValue, newValue);
        if (!equals) {
            this.tagCacheService.addTagsToCache(newValue);
            this.emitLocalEvent({ eventName: 'tagGroupsUpdate', value: newValue });
        }
    }

    getTagGroupList() {
        let serviceResponse: ServiceResponse;
        serviceResponse = this.tagCacheService.getTagGroupList() as ServiceResponse;
        serviceResponse.responseObservable.toPromise().then(response => {
            const responseId = response.json().responseId as string;
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.getAllTagGroupsAndTags });
        });
    }

}
