export const applicationConstants = {
    mergelyUrl: '/assets/mergely/mergely.html',
    ufPreviewUrl: '/assets/preview_content/preview.html',
    allowedImageExtensions: /(\.jpg|\.jpeg|\.png|\.gif)$/i,
    allowedCodeExtensions: /(\.txt|\.cs)$/i,
    inputPattern: {
        fileName: new RegExp('^[^\:*?"<>|/]*$'),
    },
    favouriteProjectLocalStorageKey: 'favourite_project_',
    recentProjectLocalStorageKey: 'recent_project_',
    diffMaxCharLength: 100,
    projectLimit: 10,
    projectRefreshInterval: 250,
    notificationClearInterval: 20000,
    dateTimeFormat: 'DD/MM/YYYY, hh:mm:ss A',
    operation: {
        getProjects: { eventName: 'getProjectsEvent' },
        addNode: { eventName: 'addNodeEvent', raiseOperationEvent: true },
        validateDraftContent: { eventName: 'validateDraftContentEvent' },
        acceptDraftToLive: { eventName: 'acceptDraftToLiveEvent', raiseOperationEvent: true },
        updateNode: { eventName: 'updateNodeEvent', raiseOperationEvent: true },
        getBranchList: { eventName: 'getBranchListEvent' },
        createDistribution: { eventName: 'createDistributionEvent', raiseOperationEvent: true },
        createDraftWithSnapshot: { eventName: 'createDraftWithSnapshotEvent', raiseOperationEvent: true },
        createDraftWithContent: { eventName: 'createDraftWithContentEvent', raiseOperationEvent: true },
        getDistributionsForProject: { eventName: 'getDistributionsForProjectEvent' },
        getDocumentActivity: { eventName: 'getDocumentActivityEvent' },
        getDraftHistory: { eventName: 'getDraftHistoryEvent' },
        importDistribution: { eventName: 'importDistributionEvent', raiseOperationEvent: true },
        getProjectAdmin: { eventName: 'getProjectAdminEvent' },
        assignOrRemoveProjectAdmin: { eventName: 'assignOrRemoveProjectAdminEvent', raiseOperationEvent: true },
        getSystemAdmin: { eventName: 'getSystemAdminEvent' },
        assignOrRemoveSystemAdmin: { eventName: 'assignOrRemoveSystemAdminEvent', raiseOperationEvent: true },
        addTagsToNode: { eventName: 'addTagsToNodeEvent', raiseOperationEvent: true },
        getTagsForNode: { eventName: 'getTagsForNodeEvent' },
        deleteTagsFromNode: { eventName: 'deleteTagsFromNodeEvent', raiseOperationEvent: true },
        getUserDetails: { eventName: 'getUserDetailsEvent' },
        addTagGroupsToProject: { eventName: 'addTagGroupsToProjectEvent', raiseOperationEvent: true },
        getTagGroupsForProject: { eventName: 'getTagGroupsForProjectEvent' },
        deleteTagGroupsFromProject: { eventName: 'deleteTagGroupsFromProjectEvent', raiseOperationEvent: true },
        searchAssets: { eventName: 'searchAssetsEvent' },
        getAsset: { eventName: 'getAssetEvent' },
        updateAssetProperties: { eventName: 'updateAssetPropertiesEvent', raiseOperationEvent: true },
        upsertAsset: { eventName: 'upsertAssetEvent', raiseOperationEvent: true },
        getAccessExecutionMetrics: { eventName: 'getAccessExecutionMetricsEvent' },
        getCacheMetrics: { eventName: 'getCacheMetricsEvent' },
        getUserList: { eventName: 'getUserListEvent' },
        createDraft: { eventName: 'createDraftEvent', raiseOperationEvent: true },
        getPersonalUpdate: { eventName: 'getPersonalUpdateEvent' },
        getRepositoryList: { eventName: 'getRepositoryListEvent' },
        createProject: { eventName: 'createProjectEvent', handleNotification: false, raiseOperationEvent: true },
        getPublishHistory: { eventName: 'getPublishHistoryEvent' },
        getDistributionsQueuedForPublish: { eventName: 'getDistributionsQueuedForPublishEvent' },
        getNodesForLiveDraftsAfterDistributionPublish: { eventName: 'getNodesForLiveDraftsAfterDistributionPublishEvent' },
        getNodeListForPublish: { eventName: 'getNodeListForPublishEvent' },
        publishDistribution: { eventName: 'publishDistributionEvent', raiseOperationEvent: true },
        getRealtimeUpdate: { eventName: 'realtimeUpdateEvent', signalRTopic: 'GetRealtimeUpdatesResponse' },
        deleteDraft: { eventName: 'deleteDraftEvent', raiseOperationEvent: true },
        renameDraft: { eventName: 'renameDraftEvent', raiseOperationEvent: true },
        getAllTagGroupsAndTags: { eventName: 'getAllTagGroupsAndTagsEvent' },
        createTagGroup: { eventName: 'createTagGroupEvent', raiseOperationEvent: true },
        editTagGroup: { eventName: 'editTagGroupEvent', raiseOperationEvent: true },
        createTag: { eventName: 'createTagEvent', raiseOperationEvent: true },
        editTag: { eventName: 'editTagEvent', raiseOperationEvent: true },
        changeNodeLocation: { eventName: 'changeNodeLocationEvent', raiseOperationEvent: true },
        deleteNode: { eventName: 'deleteNodeEvent', raiseOperationEvent: true },
        getNodesForDistribution: { eventName: 'getNodesForDistributionEvent' },
        addTagsToMultipleNodes: { eventName: 'addTagsToMultipleNodesEvent', raiseOperationEvent: true },
        deleteTagsFromMultipleNodes: { eventName: 'deleteTagsFromMultipleNodesEvent', raiseOperationEvent: true },
        uploadUserProfilePic: { eventName: 'uploadUserProfilePicEvent', raiseOperationEvent: true },
        deleteUserProfilePic: { eventName: 'deleteUserProfilePicEvent', raiseOperationEvent: true },
        viewDraftSnapshot: { eventName: 'viewDraftSnapshotEvent' },
        getDraftsForNode: { eventName: 'getDraftsForNodeEvent' },
        md: { eventName: 'mdEvent' },
        html: { eventName: 'htmlEvent' },
        xml: { eventName: 'xmlEvent' },
        getPendingResponses: { eventName: 'getPendingResponsesEvent' },
        updateDistribution: { eventName: 'updateDistributionEvent', raiseOperationEvent: true },
    },
    assetType: {
        none: 0,
        codeSnippet: 2,
        image: 1,
        binary: 3,
        internalArticleUrl: 4
    },
    dragDropComponentViewType: {
        uploadView: 1,
        replaceView: 2
    },
    assetViewType: {
        recentAssets: 1,
        myAssets: 2,
    },
    eventStatus: {
        unknown: 0,
        wait: 1,
        success: 2,
        failure: 3,
    },
    draftSnapshotValidStatus: {
        Unknown: 0,
        Valid: 1,
        Invalid: 2,
    },
    filterType: {
        ById: 1,
        ByText: 2,
    },
    notificationType: {
        Targeted: 1,
        Broadcast: 2
    },
    confirmButtonText: {
        Create: 'Create',
        Delete: 'Delete'
    },
    roles: {
        Author: 'Author',
        ProjectAdmin: 'ProjectAdmin',
        SystemAdmin: 'SystemAdmin',
    },
    cropperSettings: {
        dynamicSizing: false,
        width: 150,
        height: 150,
        maxWidth: 150,
        maxHeight: 150,
        croppedWidth: 150,
        croppedHeight: 150,
        canvasWidth: 500,
        canvasHeight: 300,
        minWidth: 150,
        minHeight: 150,
        rounded: false,
        keepAspect: true,
        preserveSize: true,
        noFileInput: true,
        showCenterMarker: false,
        cropperDrawSettings: { strokeColor: '#00bcd4', strokeWidth: 1 }
    },
    cropPosition: {
        x: 10,
        y: 10,
        w: 150,
        h: 150,
    }
};

export const actions = [
    { 'actionId': 1, 'actionName': 'Accept Draft To Live' },
    { 'actionId': 2, 'actionName': 'Create Draft' },
    { 'actionId': 3, 'actionName': 'Rename Draft' },
    { 'actionId': 4, 'actionName': 'Delete Draft' },
    { 'actionId': 5, 'actionName': 'Change Node Location' },
    { 'actionId': 6, 'actionName': 'Add Tags To Node' },
    { 'actionId': 7, 'actionName': 'Remove Tags From Node' },
    { 'actionId': 8, 'actionName': 'Update Short Title' },
    { 'actionId': 9, 'actionName': 'Update Title' },
    { 'actionId': 10, 'actionName': 'Update File Name' },
];

export const assetTags = {
    assetImageStart: '<dw-image>',
    assetImageEnd: '</dw-image>',
    assetCodeStart: '<dw-code>',
    assetCodeEnd: '</dw-code>',
    assetLinkStart: '<dw-link>',
    assetLinkEnd: '</dw-link>'
};

export enum cmsOperation {
    NA = 0,

    CreateProject = 1,

    GetProjects = 2,

    CreateDistribution = 4,

    CreateDraftWithDistribution = 5,

    GetNodesForDistribution = 6,

    GetProjectRepositoryBranches = 7,

    GetBranchList = 8,

    GetRepositoryList = 9,

    GetDistributionsForProject = 10,

    EventHandlerTest = 10000,

    GetDraftsForNode = 11,

    AcceptDraftToLive = 12,

    GetDraftContentAsMarkdown = 13,

    PeriodicSync = 15,

    DistributionPullPush = 16,

    CreateDraft = 17,

    AddNode = 18,

    ValidateDraftContent = 19,

    GetAssets = 20,

    UpsertAsset = 21,

    CreateDraftPartial = 22,

    GetDraftContentAsHtml = 23,

    GetAllTagGroupsAndTags = 24,

    SyncCreateCoderDraftSnapShot = 25,

    CreateTagGroup = 26,

    EditTagGroup = 27,

    CreateTag = 28,

    EditTag = 29,

    AddTagGroupsToProject = 30,

    GetTagsForTagGroup = 31,

    GetDraftHistory = 33,
    GetTagsForNode = 34,

    UpdateAssetProperties = 35,

    GetAsset = 36,

    PublishDistribution = 37,

    AddTagsToNode = 38,

    UpdateMdTreeStructure = 39,

    DeleteTagsFromNode = 40,

    UpdateDistribution = 41,

    UpdateProject = 42,

    UpdateNode = 43,

    ChangeNodeLocation = 44,

    GetTagGroupsForProject = 45,

    SearchAssets = 46,

    GetTagsToDeleteFromProject = 47,

    RenameDraft = 48,

    DeleteTagGroupsFromProject = 49,

    ViewDraftSnapshot = 50,

    CreateDraftWithSnapshot = 51,

    GetPublishQueues = 52,

    GetNodesForLiveDraftsAfterDistributionPublish = 53,

    GetDistributionsQueuedForPublish = 54,

    CreateDefaultDraft = 55,

    AcceptDraftToLivePartialForSourceSync = 56,

    GetUserDetails = 57,

    AssignOrRemoveSystemAdmin = 58,

    GetSystemAdmin = 59,

    GetRolesAndPermissions = 60,

    DeleteDraft = 61,

    GetProject = 62,

    AssignOrRemoveProjectAdmin = 63,

    GetProjectAdmin = 64,

    DeleteNode = 65,

    DeleteNodePartial = 66,

    GetDraftContentAsXml = 67,

    GetDocumentActivity = 68,

    UploadUserProfilePic = 69,

    GetLatestSnapshotForDraft = 70,

    DeleteUserProfilePic = 71,

    UpdateNodeTitle = 72,

    CreateNewFileForDuplicateFileName = 73,

    InsertRealtimeUpdate = 74,

    CreateDraftWithContent = 75,

    GetRealtimeUpdate = 76,

    AddTagsToMultipleNodes = 77,
    DeleteTagsFromMultipleNodes = 78,

    AddSnapshotToDraft = 79,

    ImportDistribution = 80,

    ImportDistributionPartial = 81,

    GetDistribution = 82,

    GetExtractedLinks = 83,

    DeleteTag = 10001,
    DeleteTagGroup = 10002,
    DeleteProject = 10003,
    DeleteDistribution = 10004
}

export enum eventStatus {
    Unknown = 0,
    Wait = 1,
    Success = 2,
    Failure = 3,
}

export const entityStatus = {
    None: 0,
    Wait: 1,
    Ok: 2,
    Error: 3,
    0: 'None',
    1: 'Wait',
    2: 'Ok',
    3: 'Error',
};

export const topics = {
    Dashboard: 'Topics/Dashboard',
    Project: 'Project',
    Distribution: 'Distribution',
    Node: 'Node',
    PublishQueue: 'Topics/PublishQueue',
    PublishHistory: 'Topics/PublishHistory',
    Asset: 'Asset',
    SystemAdmin: 'Topics/SystemAdmin',
};

export const pageTitleList = {
    publishList: 'Unity DocWorks - Publish List',
    addProject: 'Unity DocWorks - Add Project',
    projectList: 'Unity DocWorks - Dashboard',
    createDistribution: 'Unity DocWorks - Create Distribution',
    distribution: 'Unity DocWorks - Distribution',
    manageTagGroupNodeLevel: 'Unity DocWorks - Manage Tag Groups - Node level',
    manageTagGroupProjectLevel: 'Unity DocWorks - Manage Tag Groups - Project level',
    manageTags: 'Unity DocWorks - Manage Tags',
    addDraft: 'Unity DocWorks - Add Draft',
    system: 'Unity DocWorks - System',
    tagManagementNodeLevel: 'Unity DocWorks - tag management - node level',
    addTagGroup: 'Unity DocWorks - Add Tag Group',
    errorDetail: 'Unity DocWorks - Error Detail',
    addNode: 'Unity DocWorks - Add Node',
    manageSystemAdmins: 'Unity DocWorks - Manage System Admins',
    manageProjectAdmins: 'Unity DocWorks - Manage Project Admins',
    analytics: 'Analytics',
    manageTagsForMultipleNodes: 'Unity DocWorks - Manage Tags For Multiple Nodes',
    deleteTagGroup: 'Unity DocWorks - Delete Tag group',
    deleteTag: 'Unity DocWorks - Delete Tag',
    deleteDistribution: 'Unity DocWorks - Delete Distribution',
    deleteProject: 'Unity DocWorks - Delete Project',
    developerDashboard: 'Unity DocWorks - Delete Developer-Dashboard'
};

export enum DraftType {
    CoderDraft = 1,
    WorkInProgress = 2,
    LiveDraft = 3,
}

export enum DocumentationType {
    None = 0,
    KnowledgeBase = 1,
    Tutorial = 2,
    Manual = 3,
    ScriptRef = 4
}

export enum DiffOperation {
    DELETE = 0,
    INSERT = 1,
    EQUAL = 2
}

export const DraftCreationType = {
    URL: '1',
    ExistingDraft: '2',
    Blank: '3',
    Templates: '4'
};

export const NodeCreationType = {
    URL: '1',
    Blank: '2',
    Templates: '3',
    None: '4',
    ExistingDraft: '5'
};

export enum SourceControlType {
    GIT = 1,
    Mercurial = 2
}

export enum SourceControlProviderType {
    GitLab = 1,
    GitHub = 2,
    Mercurial = 3
}

export const TagGroupType = {
    OtherTagGroup: 0,
    UserTagGroup: 1,
    DateTagGroup: 2,
};

export const PublishNodeOperation = {
    1: {
        title: 'Accept draft to live',
        class: 'AcceptDraftToLive',
        icon: 'pencil-box-outline'
    },
    4: {
        title: 'Delete draft',
        class: 'DeleteDraft',
        icon: 'delete-sweep'
    },
    5: {
        title: 'Change node location',
        class: 'ChangeNodeLocation',
        icon: 'file-tree'
    },
    6: {
        title: 'Add Tags To Node ',
        class: 'AddTagsToNode',
        icon: 'tag-plus'
    },
    7: {
        title: 'Delete Tags From Node',
        class: 'DeleteTagsFromNode',
        icon: 'tag-remove'
    },
    8: {
        title: 'Rename Short Title',
        class: 'RenameShortTitle',
        icon: 'pencil-circle-outline'
    },
    10: {
        title: 'Rename File Name',
        class: 'RenameFileName',
        icon: 'pencil-box-outline'
    },
    11: {
        title: 'Delete node',
        class: 'DeleteNode',
        icon: 'delete-circle'
    }
};

export const MultipleNodesTaggingOperation = {
    AddTags: 0,
    RemoveTags: 1
};

export const nodeStatus = {
    0: {
        title: 'published',
        class: 'published'
    },
    1: {
        title: 'Publish queue',
        class: 'publish-queue',
    },
    2: {
        title: 'in-Progress',
        class: 'in-progress'
    },
    3: {
        title: 'Version control updated',
        class: 'version-control-updated',
    },
    4: {
        title: 'waiting',
        class: 'waiting'
    },
    5: {
        title: 'not started',
        class: 'not-started'
    },
    6: {
        title: 'No Status',
        class: 'no-status',
    }
};

export const localisation = {
    1: 'EN',
    2: 'JP',
    3: 'CH',
    4: 'FR',
    5: 'DE'
};
