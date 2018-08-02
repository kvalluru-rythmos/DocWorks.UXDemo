import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { topics } from '../constants';
import { OperationBaseComponent } from '../operation-base/operation-base.component';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
})
export class ProjectComponent extends OperationBaseComponent implements OnInit {

    constructor(private route: ActivatedRoute, public injector: Injector) {
        super(injector, { title: undefined } as any);

    }
    projectId: any;
    selectedProject: any;

    ngOnInit() {
        this.subscribeForRouteParams();
    }

    subscribeForRouteParams() {
        this.route.params.subscribe(params => {
            this.projectId = params.projectId;
            this.projectService.setProjectIdToCache(params.projectId);
            this.unsubscribe();
            this.topic = { value: topics.Project + '/' + this.projectId, subscriptionTopic: topics.Project + '/' + this.projectId, eventName: 'updateDistributionList' };
            this.subscribeTopic();
            this.getDistributionList(this.projectId);
        });

    }

    updateDistributionList(value) {
        this.getDistributionList(this.projectId);
    }
}
