import { Component, OnInit } from '@angular/core';
import { StorageService } from '../common/storage.service';
import { UserService } from '../common/user.service';
import * as _ from 'underscore';
import { ProjectService } from '../project/project.service';

@Component({
    selector: 'app-recently-viewed-document',
    templateUrl: './recently-viewed-document.component.html'
})
export class RecentlyViewedDocumentComponent implements OnInit {

    recentlyViewedDocuments = [];

    constructor(private storageService: StorageService, private userService: UserService, private projectService: ProjectService) {
    }

    ngOnInit() {
        this.getRecentlyViewedDocuments();
    }

    getRecentlyViewedDocuments() {
        const projects = this.projectService.getProjectsFromCache();
        const recentlyViewedDocumentArray = this.storageService.read<any[]>('recently_viewed_documents_' + this.userService.user.profile.userId);
        _.each(recentlyViewedDocumentArray, function (document) {
            const value = _.find(projects, function (project) {
                return project._id === document.projectId;
            }.bind(this));
            if (value) {
                this.recentlyViewedDocuments.push(document);
            }
        }.bind(this));
    }
}
