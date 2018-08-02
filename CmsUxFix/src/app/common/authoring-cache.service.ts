import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { ProjectContent } from '../project/project';
import { StorageService } from './storage.service';

@Injectable()
export class AuthoringCacheService {

    selectedProjectId: string;
    selectedDistributionId: string;
    selectedNodeId: string;
    selectedLeftDraftId: string;
    selectedRightDraftId: string;

    projects: ProjectContent[] = [];

    constructor(private storageService: StorageService) {
        this.projects = JSON.parse(JSON.stringify(this.getProjects()));
    }

    setProjects(data: ProjectContent[]) {
        this.projects = data;
        this.storageService.write('CachedProjects', this.projects);
    }

    getProjects() {
        const projects = this.storageService.read<[ProjectContent]>('CachedProjects');
        return projects ? projects : [];
    }

    getDistributions(projectId) {
        const distributions = this.storageService.read('Distributions');
        return distributions ? distributions[projectId] : undefined;
    }

    setDistributions(projectId, distributions) {
        let distributionList = this.storageService.read('Distributions');
        if (!distributionList) {
            distributionList = {};
        }
        distributionList[projectId] = distributions ? distributions : [];
        this.storageService.write('Distributions', distributionList);
    }

    setBranches(projectId, branches) {
        let branchList = this.storageService.read('Branches');
        if (!branchList) {
            branchList = {};
        }
        branchList[projectId] = branches ? branches : [];
        this.storageService.write('Branches', branchList);
    }

    getBranches(projectId) {
        const branchList = this.storageService.read('Branches');
        return branchList ? branchList[projectId] : undefined;
    }

    getNodes(distributionId) {
        let nodes = this.storageService.read('Nodes');
        return nodes ? nodes[distributionId] : undefined;
    }

    getOrphanNodes(distributionId) {
        let nodes = this.storageService.read('OrphanNodes');
        return nodes ? nodes[distributionId] : undefined;
    }

    setNodes(distributionId, value) {
        const nodes = this.setTreeNodes(distributionId, value.orphanNodeList, 'OrphanNodes');
        const orphanNodes = this.setTreeNodes(distributionId, value.nodeList, 'Nodes');
        return nodes || orphanNodes;
    }

    setTreeNodes(distributionId, value, listName) {
        let nodeList = this.storageService.read(listName);
        if (!nodeList) {
            nodeList = {};
        }
        if (nodeList[distributionId] && (JSON.stringify(nodeList[distributionId]) === JSON.stringify(value))) {
            return undefined;
        } else {
            nodeList[distributionId] = value ? value : [];
            this.storageService.write(listName, nodeList);
            return nodeList[distributionId];
        }
    }

    getDrafts(nodeId) {
        let drafts = this.storageService.read('Drafts');
        return drafts ? drafts[nodeId] : undefined;
    }

    setDrafts(nodeId, value) {
        let drafts = this.storageService.read('Drafts');
        if (!drafts) {
            drafts = {};
        }
        drafts[nodeId] = value ? value : [];
        this.storageService.write('Drafts', drafts);
    }

    getSelectedProject() {
        return this.getProjectById(this.selectedProjectId);
    }

    getSelectedDistribution() {
        const distributions = this.storageService.read('Distributions');

        const distribution = _.find((distributions && distributions[this.selectedProjectId]) ? distributions[this.selectedProjectId] : [], function (value) {
            return value.distributionId === this.selectedDistributionId;
        }.bind(this));
        return distribution ? distribution : {};
    }

    getSelectedNode() {
        const nodes = this.storageService.read('Nodes');
        const node = _.find((nodes && nodes[this.selectedDistributionId]) ? nodes[this.selectedDistributionId] : [], function (value) {
            return value.nodeId === this.selectedNodeId;
        }.bind(this));
        return node ? node : {};
    }

    addProject(selectedProject) {
        const projects = this.getProjects();
        if (_.find(projects, function (project) { return project._id === selectedProject.projectId; })) {
            return;
        } else {
            this.projects.push(selectedProject);
        }
    }

    getProjectById(projectId) {
        const project = _.find(this.projects, function (value) {
            return value._id === projectId;
        }.bind(this));
        return project ? project : new ProjectContent();
    }


    setDraftContent(draftId, contentType, fileContent) {
        let draftContentList = this.storageService.read('DraftContent');
        if (!draftContentList) {
            draftContentList = {};
        }
        const draft = draftContentList[draftId];
        if (!draft) {
            draftContentList[draftId] = {};
        }
        if (draftContentList[draftId][contentType] === fileContent) {
            return;
        } else {
            draftContentList[draftId][contentType] = fileContent;
        }
        this.storageService.write('DraftContent', draftContentList);
    }

    getDraftContent(draftId, contentType) {
        let draftContentList = this.storageService.read('DraftContent');
        if (!draftContentList) {
            return;
        }
        if (!draftContentList[draftId]) {
            return;
        } else {
            return draftContentList[draftId][contentType];
        }
    }

    updateProjectTagGroups(data: any) {
        _.each(this.projects, function (project) {
            if (project._id === data.value._id) {
                project.tagGroups = data.value.tagGroups;
            }
        });
        this.storageService.write('CachedProjects', this.projects);
    }
}
