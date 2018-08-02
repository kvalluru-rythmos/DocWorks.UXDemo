import { DocumentationType, SourceControlProviderType, SourceControlType } from '../constants';

export class Project {
    projects: ProjectContent[];
    status: number;
    ProjectName: string;
    repoUrl: string;
    typeOfContent: string;
    description: string;
    projectAdmins: any;
}

export class ProjectContent {
    _id: string;
    status: number;
    projectName: string;
    typeOfContent: DocumentationType;
    sourceControlProviderType: SourceControlProviderType;
    sourceControlType: SourceControlType;
    projectAdmins: any;
}

export class TypeOfContent {
    key: string;
    value: string;
}
