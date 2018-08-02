import { Component, OnInit, Injector } from '@angular/core';
import { TypeOfContent } from '../project/project';
import { ProjectService } from '../project/project.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Operation } from '../operation-status/operation';
import { cmsOperation, eventStatus, pageTitleList, SourceControlType, applicationConstants } from '../constants';
import { BaseComponent } from '../base.component';
import { MatDialogRef } from '@angular/material';
import { WhiteSpaceValidator } from '../common/whitespace-validator';
import { sourceControlProviderTypes } from './sourceControlProviders';
import { ServiceResponse } from '../common/data-promise-response';

@Component({
    selector: 'app-project-add',
    templateUrl: './project-add.component.html'
})

export class ProjectAddComponent extends BaseComponent implements OnInit {
    isRepoURLDataLoadInProgress: boolean;
    isContentDataLoadInProgress: boolean;
    typeOfContentArray: TypeOfContent[];
    repositoriesArray: any[];
    projectForm: FormGroup;
    sourceControlTypes = SourceControlType;
    sourceControlProvidersArray = sourceControlProviderTypes;
    projectTitle = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100), WhiteSpaceValidator]);
    typeOfContent = new FormControl('', [Validators.required]);
    sourceControlProviderType = new FormControl('', [Validators.required]);
    mercurialRepoPath = new FormControl('', [Validators.maxLength(1000), WhiteSpaceValidator]);
    repoUrl = new FormControl('');
    description = new FormControl('', [Validators.maxLength(1000), WhiteSpaceValidator]);
    publishedPath = new FormControl('', [Validators.minLength(5), Validators.maxLength(100), WhiteSpaceValidator]);

    constructor(private projectService: ProjectService, public injector: Injector,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<ProjectAddComponent>) {
        super(injector, { title: pageTitleList.addProject } as any);
        this.isRepoURLDataLoadInProgress = true;
        this.isContentDataLoadInProgress = true;
        this.createAddProjectForm();
    }

    ngOnInit() {
        this.getTypeOfContent();
        this.sourceControlProviderType.setValue(this.sourceControlProvidersArray[0], { onlySelf: true });
        this.getRepositories();
    }

    createAddProjectForm() {
        this.projectForm = this.formBuilder.group({
            projectTitle: this.projectTitle,
            typeOfContent: this.typeOfContent,
            repoUrl: this.repoUrl,
            description: this.description,
            publishedPath: this.publishedPath,
            sourceControlProviderType: this.sourceControlProviderType,
            mercurialRepoPath: this.mercurialRepoPath
        });
    }

    getRepositories() {
        this.repositoriesArray = [];
        this.isRepoURLDataLoadInProgress = true;
        let serviceResponse: ServiceResponse;
        serviceResponse = this.projectService.getRepositories(this.sourceControlProviderType.value.providerId) as ServiceResponse;
        if (serviceResponse.data && serviceResponse.data.length >= 0) {
            this.setRepositoryList(serviceResponse.data);
        }
        serviceResponse.responseObservable.toPromise().then(response => {
            const responseId = response.json().responseId as string;
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.getRepositoryList });
        });
    }

    getTypeOfContent() {
        this.projectService.getTypeOfContent().then(response => {
            this.typeOfContentArray = response as TypeOfContent[];
            this.isContentDataLoadInProgress = false;
        });
    }

    addProject() {
        const project = this.createProjectObject(this.projectForm.value);
        this.projectService.addProject(project).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.createProject });
            const operation = new Operation(responseId, cmsOperation.CreateProject, eventStatus.Wait, { projectName: project.projectName });
            this.addOperationEvent(operation);
        });
        this.dialogRef.close();
    }

    getRepositoryListEvent(notification: any) {
        this.setRepositoryList(notification.data.content.repositories);
    }

    setRepositoryList(repositories) {
        this.isRepoURLDataLoadInProgress = false;
        this.repositoriesArray = repositories;
    }

    createProjectObject(value): any {
        return {
            projectName: value.projectTitle,
            repositoryId: value.sourceControlProviderType.sourceControlType === this.sourceControlTypes.GIT ? value.repoUrl.repositoryId : 0,
            repositoryName: value.sourceControlProviderType.sourceControlType === this.sourceControlTypes.GIT ? value.repoUrl.repositoryName : '',
            typeOfContent: value.typeOfContent,
            description: value.description,
            publishedPath: value.publishedPath,
            sourceControlProviderType: value.sourceControlProviderType.providerId,
            mercurialRepositoryUrl: value.sourceControlProviderType.sourceControlType === this.sourceControlTypes.Mercurial ? value.mercurialRepoPath : ''
        };
    }

    sourceControlProviderChange() {
        this.getRepositories();
    }
}
