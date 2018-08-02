import {Component, OnInit, Injector} from '@angular/core';
import {ProjectContent} from './project';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {CreateDistributionComponent} from '../create-distribution/create-distribution.component';
import * as _ from 'underscore';
import {entityStatus, pageTitleList, DocumentationType, applicationConstants, topics} from '../constants';
import {ManageProjectTagGroupComponent} from '../manage-project-tag-group/manage-project-tag-group.component';
import {ProjectAddComponent} from '../project-add/project-add.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {LocalEventEmitterService} from '../common/local-event-emitter.service';
import {ManageProjectAdminsComponent} from '../manage-admins/manage-project-admins.component';
import {OperationBaseComponent} from '../operation-base/operation-base.component';
import {DeleteProjectConfirmationDialogComponent} from '../delete-project-confirmation-dialog/delete-project-confirmation-dialog.component';
import {SignalrService} from '../common/signalr.service';

export const navigationType = {
  NavigateToDistribution: 'NavigateToDistribution',
  CreateDistribution: 'CreateDistribution'
};

@Component({
  selector: 'app-project-list',
  templateUrl: './projectList.component.html',
})
export class ProjectListComponent extends OperationBaseComponent implements OnInit {
  projects: ProjectContent[] = [];
  favouriteAndRecentProjects: any;
  isGridView = true;
  searchString: string;
  selectedProject: any;
  entityStatus = entityStatus;
  documentationType = DocumentationType;
  projectsLoaded = false;
  isProgressShow = false;
  navigationType: string;

  startupParameters = {
    reference: this,
    startupRequestCallbacks: [this.getProjects],
    events: [{
      name: 'GotProjects',
      callback: this.gotProjectsResponse
    }
    ]
  };

  constructor(public injector: Injector, private router: Router, public dialog: MatDialog,
              public localEventEmitterService: LocalEventEmitterService, private signalr: SignalrService) {
    super(injector, {title: pageTitleList.projectList} as any);
    this.loggedInUserId = this.userService.user ? (this.userService.user.profile ? this.userService.user.profile.userId : '') : '';
    // this.topic = { value: topics.Dashboard, subscriptionTopic: topics.Dashboard, eventName: 'refreshProjectAndTagGroupEvent' };
    // this.subscribeTopic();
  }

  ngOnInit() {
    // this.getProjects();
    this.signalr.startup(this.constructor.name, this.startupParameters);
  }

  gotProjectsResponse(response: any) {
    const newValue = response;
    const oldValue = this.authoringCacheService.getProjects();
    const equals = this.equals(oldValue, newValue);
    if (!equals) {
      this.refreshProjects({value: newValue});
      this.projectService.setProjects(newValue);
    }
  }

  refreshProjectAndTagGroupEvent() {
    this.getProjects();
  }

  refreshProjects(data) {
    this.projectsLoaded = true;
    const projects = data.value;
    let pageNumber = 0;
    this.projects = [];
    this.projects = projects;
    this.getFavouriteAndRecentProjects();
  }

  navigateToAuthoringPane(project: ProjectContent) {
    this.navigationType = navigationType.NavigateToDistribution;
    this.selectedProject = project;
    this.isProgressShow = true;
    this.projectService.setProjectIdToCache(project._id);
    const isProjectAdmin = this.authorizationService.isProjectAdmin(project.projectAdmins);
    if (isProjectAdmin) {
      this.userService.assignRole(applicationConstants.roles.ProjectAdmin);
    } else {
      this.userService.removeRole(applicationConstants.roles.ProjectAdmin);
    }
    this.getDistributionList(this.selectedProject._id, false);
  }

  refreshDistributions(data: any) {
    if (data.value.projectId === this.selectedProject._id) {
      this.isProgressShow = false;
      if (this.navigationType === navigationType.NavigateToDistribution) {
        if (data.value.distributions.length > 0) {
          const distribution = this.findDefaultDistribution(data.value.distributions);
          if (distribution) {
            const distributionId = distribution.distributionId;
            this.distributionService.setDistrubutionIdToCache(distributionId);
            this.addToRecentProjects();
            this.router.navigate(['/project', this.selectedProject._id, 'distribution', distributionId]);
          } else {
            this.navigationType = undefined;
            this.checkDistributionCreationAccess();
          }
        } else {
          this.navigationType = undefined;
          this.checkDistributionCreationAccess();
        }
      } else if (this.navigationType === navigationType.CreateDistribution) {
        this.openDistributionsDialog(this.selectedProject, data.value.distributions);
      }
    }
  }

  addToRecentProjects() {
    const key = applicationConstants.recentProjectLocalStorageKey + this.userService.user.profile.userId;
    const project = {
      projectId: this.selectedProject._id,
      addedOn: new Date().getTime() / 1000
    };
    this.projectService.updateProjectInLocalStorage(project, key, true, true);
  }

  findDefaultDistribution(distributions) {
    return _.find(distributions, function (value) {
      return value.status === entityStatus.Ok;
    });
  }

  checkDistributionCreationAccess() {
    const isProjectAdmin = this.authorizationService.isProjectAdmin(this.selectedProject.projectAdmins);
    if (this.authorizationService.isOperationAllowed([this.cmsOperations.CreateDistribution]) || isProjectAdmin) {
      this.showUnavailableDistributionsDialog();
    } else {
      this.dialog.open(ConfirmDialogComponent, {
        data: {message: 'No distributions available, Please contact system/project admin.', showButton: false},
        width: '400px'
      });
    }
  }

  showUnavailableDistributionsDialog() {
    this.isProgressShow = false;
    if (this.selectedProject.typeOfContent !== DocumentationType.KnowledgeBase) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: 'No distributions available.Do you want to create one?',
          showButton: true,
          buttonText: applicationConstants.confirmButtonText.Create
        }, width: '400px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.openDistributionsDialog(this.selectedProject, []);
        }
      });
    } else {
      this.dialog.open(ConfirmDialogComponent, {
        data: {message: 'No distributions available', showButton: false}, width: '400px'
      });
    }
  }

  openDistributionsDialog(project, distributions) {
    this.navigationType = undefined;
    const dialogRef = this.dialog.open(CreateDistributionComponent, {
      data: {selectedProject: project, distributions: distributions},
      width: '560px',
      minHeight: '480px',
      maxHeight: '530px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.isProgressShow = false;
    });
  }

  createDistribution(project: ProjectContent): void {
    this.selectedProject = project;
    this.navigationType = navigationType.CreateDistribution;
    this.isProgressShow = true;
    this.getDistributionList(this.selectedProject._id);
  }

  openCreateProjectDialog() {
    this.dialog.open(ProjectAddComponent, {
      width: '560px',
    });
  }

  openManageTagGroupsDialog(project: any) {
    this.dialog.open(ManageProjectTagGroupComponent, {
      data: {
        project: project,
      }, width: '990px', height: '600px'
    });
  }

  openManageAdminDialog(project: ProjectContent) {
    this.dialog.open(ManageProjectAdminsComponent, {
      data: {
        project: project,
      }, width: '990px', height: '600px'
    });
  }

  getProjectClass(project: any) {
    if (project.status === this.entityStatus.Wait) {
      return 'wait';
    } else if (project.status === this.entityStatus.None || project.status === this.entityStatus.Error) {
      return 'error';
    } else {
      return 'success';
    }
  }

  ProjectTagGroupsUpdateEvent(data: any) {
    this.projectService.updateCachedProject(data);
  }

  addRemoveFavouriteProject(isAdd, projectId) {
    const key = applicationConstants.favouriteProjectLocalStorageKey + this.userService.user.profile.userId;
    this.projectService.updateProjectInLocalStorage(projectId, key, isAdd, false);
    this.getFavouriteAndRecentProjects();
  }

  getFavouriteAndRecentProjects() {
    this.setFavouriteToProjectCollection();
    this.setRecentToProjectCollection();
    this.favouriteAndRecentProjects = _.sortBy(_.filter(this.projects, function (project) {
      return (project.isFavourite || project.isRecent);
    }), 'recentlyViewedTime').reverse();
  }

  setFavouriteToProjectCollection() {
    if (this.userService.user && this.userService.user.profile && this.userService.user.profile.userId) {
      const favouriteProjectskey = applicationConstants.favouriteProjectLocalStorageKey + this.userService.user.profile.userId;
      const favouriteProjects = this.projectService.getProjectsFromLocalStorage(favouriteProjectskey);
      if (favouriteProjects) {
        _.each(this.projects, function (project) {
          project.isFavourite = _.contains(favouriteProjects, project._id);
        });
      }
    }
  }

  setRecentToProjectCollection() {
    if (this.userService.user && this.userService.user.profile && this.userService.user.profile.userId) {
      const recentProjectskey = applicationConstants.recentProjectLocalStorageKey + this.userService.user.profile.userId;
      const recentProjects = this.projectService.getProjectsFromLocalStorage(recentProjectskey);
      if (recentProjects) {
        _.each(this.projects, function (project) {
          const matchedProject = _.find(recentProjects, function (value) {
            return project._id === value.projectId;
          });
          project.isRecent = matchedProject ? true : false;
          project.recentlyViewedTime = matchedProject ? matchedProject.addedOn : null;
        });
      }
    }
  }

  deleteProject(project: ProjectContent) {
    this.dialog.open(DeleteProjectConfirmationDialogComponent, {
      data: project, width: '560px', minHeight: '480px', maxHeight: '530px'
    });
  }

  ngOnDestroy() {
    this.signalr.shutdown(this.constructor.name);
  }
}
