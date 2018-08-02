import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './common/authGuard';
import { AuthoringTabbedViewComponent } from './authoring-tabbed-view/authoring-tabbed-view.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { TreeViewComponent } from './treeview/treeview.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectAddComponent } from './project-add/project-add.component';
import { ProjectListComponent } from './project/projectList.component';
import { CreateDistributionComponent } from './create-distribution/create-distribution.component';
import { DistributionComponent } from './distribution/distribution.component';
import { AuthoringViewComponent } from './authoring-view/authoring-view.component';
import { NotificationSidebarComponent } from './notification-sidebar/notification-sidebar.component';
import { RecentlyViewedDocumentComponent } from './recently-viewed-document/recently-viewed-document.component';
import { NewDraftComponent } from './new-draft/new-draft.component';
import { MediaComponent } from './media/media.component';
import { MainComponent } from './main/main.component';
import { SystemSettingComponent } from './system-setting/system-setting.component';
import { TagGroupDashboardComponent } from './tag-group-dashboard/tag-group-dashboard.component';
import { CreateTagGroupComponent } from './create-tag-group/create-tag-group.component';
import { ManageTagsComponent } from './manage-tags/manage-tags.component';
import { ManageProjectTagGroupComponent } from './manage-project-tag-group/manage-project-tag-group.component';
import { ManageNodeTagComponent } from './manage-node-tag/manage-node-tag.component';
import { OperationStatusComponent } from './operation-status/operation-status.component';
import { DamDragAndDropComponent } from './dam-drag-and-drop/dam-drag-and-drop.component';
import { AssetPropertiesComponent } from './asset-properties/asset-properties.component';
import { InsertAssetComponent } from './insert-asset/insert-asset.component';
import { ReplaceAssetConfirmationComponent } from './replace-asset-confirmation/replace-asset-confirmation.component';
import { TagViewComponent } from './tag-view/tag-view.component';
import { ErrorDetailComponent } from './error-detail/error-detail.component';
import { PublishListComponent } from './publish-list/publish-list.component';
import { BaseComponent } from './base.component';
import { OperationBaseComponent } from './operation-base/operation-base.component';
import { DraftHistoryComponent } from './draft-history/draft-history.component';
import { ViewDraftComponent } from './view-draft/view-draft.component';
import { CreateDraftFromSnapshotComponent } from './create-draft-from-snapshot/create-draft-from-snapshot.component';
import { InfiniteScrollDirective } from './directives/infinite-scroll.directive';
import { GDocErrorLogComponent } from './gdoc-error-log/gdoc-error-log.component';
import { CacheResolver } from './dashboard/cacheResolver';
import { TagGroupsComponent } from './tag-groups/tag-groups.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AddNodeComponent } from './add-node/add-node.component';
import { SlimScrollDirective } from './ngx-slimscroll/directives/slimscroll.directive';
import { RolesResolverService } from './common/roles-resolver.service';
import { ManageSystemAdminsComponent } from './manage-admins/manage-system-admins.component';
import { ManageProjectAdminsComponent } from './manage-admins/manage-project-admins.component';
import { RoleGuard } from './common/roleGuard';
import { DocumentActivityComponent } from './document-activity/document-activity.component';
import { UpdateProfilePictureComponent } from './update-profile-picture/update-profile-picture.component';
import { RealtimeUpdatesComponent } from './realtime-updates/realtime-updates.component';
import { ComparisonToolComponent } from './comparison-tool/comparison-tool.component';
import { ComparisonToolFilterViewComponent } from './comparison-tool-filter-view/comparison-tool-filter-view.component';
import { CustomTooltipDirective } from './directives/custom-tooltip.directive';
import { PersonalUpdatesComponent } from './personal-updates/personal-updates.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { MetricsComponent } from './metrics/metrics.component';
import { MetricsAccessExecutionComponent } from './metrics-access-execution/metrics-access-execution.component';
import { MetricsOperationStatusComponent } from './metrics-operation-status/metrics-operation-status.component';
import { MetricsCacheComponent } from './metrics-cache/metrics-cache.component';
import { ManageTagsToMultipleNodesComponent } from './manage-tags-to-multiple-nodes/manage-tags-to-multiple-nodes.component';
import { ImportDistributionComponent } from './import-distribution/import-distribution.component';
import { ImportDistributionTreeviewComponent } from './import-distribution-treeview/import-distribution-treeview.component';
import { BatchMergeToolComponent } from './batch-merge-tool/batch-merge-tool.component';
import { InsertLinkComponent } from './insert-link/insert-link.component';
import { ProjectComponent } from './project/project.component';
import { DeleteTagGroupConfirmationDialogComponent } from './delete-tag-group-confirmation-dialog/delete-tag-group-confirmation-dialog.component';
import { DeleteTagConfirmationDialogComponent } from './delete-tag-confirmation-dialog/delete-tag-confirmation-dialog.component';
import { DeleteDistributionConfirmationDialogComponent } from './delete-distribution-confirmation-dialog/delete-distribution-confirmation-dialog.component';
import { DeleteProjectConfirmationDialogComponent } from './delete-project-confirmation-dialog/delete-project-confirmation-dialog.component';
import { AddGlossaryComponent } from './add-glossary/add-glossary.component';
import { DeveloperDashboardComponent } from './developer-dashboard/developer-dashboard.component';
import { PublishConfigurationComponent } from './publish-configuration/publish-configuration.component';
import { GlossaryHomeComponent } from './glossary-home/glossary-home.component';

export const routingComponents = [
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    DashboardComponent,
    TreeViewComponent,
    ProjectListComponent,
    AuthoringTabbedViewComponent,
    DistributionComponent,
    AuthoringViewComponent,
    NotificationSidebarComponent,
    RecentlyViewedDocumentComponent,
    MainComponent,
    SystemSettingComponent,
    TagGroupDashboardComponent,
    CreateTagGroupComponent,
    ManageTagsComponent,
    OperationStatusComponent,
    MediaComponent,
    DamDragAndDropComponent,
    AssetPropertiesComponent,
    TagViewComponent,
    ErrorDetailComponent,
    PublishListComponent,
    BaseComponent,
    OperationBaseComponent,
    DraftHistoryComponent,
    InfiniteScrollDirective,
    SlimScrollDirective,
    ManageSystemAdminsComponent,
    DocumentActivityComponent,
    RealtimeUpdatesComponent,
    ComparisonToolComponent,
    ComparisonToolFilterViewComponent,
    CustomTooltipDirective,
    PersonalUpdatesComponent,
    AnalyticsComponent,
    MetricsComponent,
    MetricsAccessExecutionComponent,
    MetricsOperationStatusComponent,
    MetricsCacheComponent,
    ImportDistributionTreeviewComponent,
    BatchMergeToolComponent,
    ProjectComponent,
    GlossaryHomeComponent,
    DeveloperDashboardComponent
];

export const entryComponents = [
    TagGroupsComponent,
    NewDraftComponent,
    InsertAssetComponent,
    ReplaceAssetConfirmationComponent,
    NewDraftComponent,
    CreateTagGroupComponent,
    ManageTagsComponent,
    ManageNodeTagComponent,
    ManageProjectTagGroupComponent,
    ViewDraftComponent,
    CreateDraftFromSnapshotComponent,
    CreateDistributionComponent,
    ProjectAddComponent,
    GDocErrorLogComponent,
    AddNodeComponent,
    ConfirmDialogComponent,
    ManageProjectAdminsComponent,
    UpdateProfilePictureComponent,
    ManageTagsToMultipleNodesComponent,
    ImportDistributionComponent,
    InsertLinkComponent,
    DeleteTagGroupConfirmationDialogComponent,
    DeleteTagConfirmationDialogComponent,
    DeleteDistributionConfirmationDialogComponent,
    DeleteProjectConfirmationDialogComponent,
    AddGlossaryComponent,
    PublishConfigurationComponent
];

export const routingProviders = [
    AuthGuard, RoleGuard
];

const routes: Routes = [{
    path: '',
    canActivate: [AuthGuard],
    component: MainComponent,
    resolve: {
        roles: RolesResolverService,
        responseId: CacheResolver
    },
    children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'system', component: SystemSettingComponent },
        { path: 'dashboard', component: DashboardComponent },
        {
            path: 'project/:projectId', component: ProjectComponent,
            children: [
                {
                    path: 'distribution/:distributionId', component: DistributionComponent,
                    children: [
                        { path: 'document/:documentId', component: AuthoringViewComponent },
                        { path: 'document/:documentId/draft/:draftId', component: AuthoringViewComponent }
                    ]
                }]
        },
        { path: 'comparison-tool', component: ComparisonToolComponent },
        { path: 'batch-merge', component: BatchMergeToolComponent },
        { path: 'media', component: MediaComponent },
        { path: 'errordetail/:responseId', component: ErrorDetailComponent },
        { path: 'publish-home', component: PublishListComponent },
        {
            path: 'analytics', component: AnalyticsComponent,
            children: [
                { path: '', redirectTo: 'metrics', pathMatch: 'full' },
                { path: 'metrics', component: MetricsComponent },
            ]
        },
        { path: 'glossary-home', component: GlossaryHomeComponent },
        { path: 'developer-dashboard', component: DeveloperDashboardComponent }
    ]
},
{ path: 'login', component: LoginComponent },
{ path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
