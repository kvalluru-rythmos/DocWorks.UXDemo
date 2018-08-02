import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DistributionService } from './distribution.service';
import { Distribution } from './distribution';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { BaseComponent } from '../base.component';
import { pageTitleList, DocumentationType, entityStatus, applicationConstants } from '../constants';
import { ProjectService } from '../project/project.service';
import { MatSidenav } from '@angular/material';
import { ImportDistributionComponent } from '../import-distribution/import-distribution.component';
import { ImportDistributionService } from '../import-distribution/import-distribution.service';

@Component({
    selector: 'app-project-distribution-view',
    templateUrl: './distribution.component.html',
})

export class DistributionComponent extends BaseComponent implements OnInit, OnDestroy {
    projectId: string;
    distributions: Distribution[];
    distributionId: string;
    distributionsForm: FormGroup;
    distribution = new FormControl('');
    isNodeSelected = true;
    selectedProject: any = {};
    documentationType = DocumentationType;
    isDistributionsLoaded = false;
    entityStatus = entityStatus;
    @ViewChild('sidenav') public sidenav: MatSidenav;

    constructor(private route: ActivatedRoute, private distributionService: DistributionService, private projectService: ProjectService,
        public injector: Injector, private router: Router, private formBuilder: FormBuilder, public dialog: MatDialog, private importDistributionService: ImportDistributionService) {
        super(injector, { title: pageTitleList.distribution } as any);
        this.distributionsForm = this.formBuilder.group({
            distribution: this.distribution
        });
    }

    ngOnInit() {
        this.subscribeForRouteParams();
    }

    subscribeForRouteParams() {
        this.route.params.subscribe(params => {
            this.projectId = this.projectService.getSelectedProjectId();
            this.distributionId = params.distributionId;
            this.distributionService.setDistrubutionIdToCache(this.distributionId);
            this.selectedProject = this.projectService.getSelectedProject();
            this.distribution.setValue(params.distributionId, { onlySelf: true });
        });
    }

    refreshDistributions(data) {
        if (data.value.projectId === this.projectService.getSelectedProjectId()) {
            this.distributions = (data && data.value && data.value.distributions) ? data.value.distributions : [];
            this.isDistributionsLoaded = true;
        }
    }

    nodeSelectedEvent(data) {
        this.isNodeSelected = data.value ? true : false;
        if (this.isNodeSelected) {
            this.sidenav.close();
        } else {
            this.sidenav.open();
        }
    }

    onDistributionChange() {
        const link = ['/project', this.projectId, 'distribution', this.distributionsForm.value.distribution];
        this.router.navigate(link);
    }

    closeSideNav() {
        if (this.isNodeSelected) {
            this.sidenav.close();
        } else {
            return;
        }
    }

    importDistribution() {
        this.dialog.open(ImportDistributionComponent, { data: { isBatchMerge: false }, width: '100%' });
    }

    batchMerge() {
        const dialogRef = this.dialog.open(ImportDistributionComponent, { data: { isBatchMerge: true }, width: '100%' });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.importDistributionService.values = result.values;
                this.importDistributionService.matchedNodes = result.matchedNodes;
                this.router.navigate(['/batch-merge']);
            }
        });
    }

    ngOnDestroy() {
        this.unsubscribe();
        this.cleanUp();
        this.userService.removeRole(applicationConstants.roles.ProjectAdmin);
    }
}
