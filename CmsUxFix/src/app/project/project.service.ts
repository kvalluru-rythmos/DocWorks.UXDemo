import { Injectable, Injector } from '@angular/core';
import { Project, ProjectContent } from './project';
import { HttpService } from '../common/http.service';
import { environment } from '../../environments/environment';
import * as _ from 'underscore';
import { StorageService } from '../common/storage.service';
import { AuthoringCacheService } from '../common/authoring-cache.service';
import { LocalEventEmitterService } from '../common/local-event-emitter.service';

@Injectable()
export class ProjectService {

    constructor(private httpService: HttpService,
        private storageService: StorageService, public injector: Injector, public authoringCacheService: AuthoringCacheService,
        public localEventEmitterService: LocalEventEmitterService) {
    }

    getProjectsFromCache() {
        return this.authoringCacheService.getProjects();
    }

    getProjects() {
        return {
            data: this.authoringCacheService.getProjects(),
            responseObservable: this.httpService.get(environment.API_BASE_URL + '/api/Projects')
        };
    }

    setProjects(value) {
        this.authoringCacheService.setProjects(value);
    }

    setProjectIdToCache(projectId) {
        this.authoringCacheService.selectedProjectId = projectId;
    }

    getSelectedProject() {
        return this.authoringCacheService.getSelectedProject();
    }

    getSelectedProjectId() {
        return this.authoringCacheService.selectedProjectId;
    }

    addProject(project: Project): Promise<string> {
        return this.httpService.post(environment.API_BASE_URL + '/api/projects', project).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    getTypeOfContent(): Promise<any> {
        return this.httpService.get(environment.API_BASE_URL + '/api/StaticFields/DocumentationType').toPromise().then(response => {
            return response.json();
        });
    }

    getRepositories(providerId: string | number) {
        return {
            data: undefined,
            responseObservable: this.httpService.get(environment.API_BASE_URL + '/api/Repositories/' + providerId)
        };
    }

    addTagGroupsToProject(requestModel: any): Promise<string> {
        return this.httpService.post(environment.API_BASE_URL + '/api/Projects/AddTagGroupsToProject', requestModel).toPromise().then(response => {
            return response.json().responseId;
        });
    }

    removeTagGroupsFromProject(requestModel: any): Promise<string> {
        return this.httpService.post(environment.API_BASE_URL + '/api/Projects/DeleteTagGroupsFromProject', requestModel).toPromise().then(response => {
            return response.json().responseId;
        });
    }

    getTagGroupsForProject(projectId: string) {
        return {
            data: undefined,
            responseObservable: this.httpService.get(environment.API_BASE_URL + '/api/Projects/' + projectId + '/tagGroups')
        };
    }

    updateProjectInLocalStorage(project, key, isAdd, isRecent) {
        if (isRecent) {
            this.updateRecentProjects(project, key);
        } else {
            this.updateFavouriteProjects(project, key, isAdd);
        }
    }

    updateRecentProjects(project, key) {
        let projectList = this.storageService.read(key) as any[];
        if (projectList) {
            projectList = _.filter(projectList, function (value) { return project.projectId !== value.projectId; });
            projectList.unshift(project);
        } else {
            projectList = [project];
        }
        this.storageService.write(key, projectList);
    }

    updateFavouriteProjects(project, key, isAdd) {
        let projectList = this.storageService.read(key) as any[];
        if (projectList) {
            projectList = _.filter(projectList, function (value) { return project !== value; });
            if (isAdd) {
                projectList.unshift(project);
            }
        } else {
            projectList = isAdd ? [project] : [];
        }
        this.storageService.write(key, projectList);
    }

    getProjectsFromLocalStorage(key) {
        return this.storageService.read(key);
    }


    updateCachedProject(data) {
        this.authoringCacheService.updateProjectTagGroups(data);
    }

    deleteProject(project: ProjectContent): Promise<string> {
        return this.httpService.delete(environment.API_BASE_URL + '/api/projects/' + project._id)
            .toPromise()
            .then(response => {
                return response.json().responseId as string;
            });
    }
}
