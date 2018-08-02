import { HttpService } from './common/http.service';
import { UserService } from './common/user.service';
import { NotificationService } from './common/notification.service';
import { StorageService } from './common/storage.service';
import { TagCacheService } from './tags/tag-cache.service';
import { OperationStatusService } from './operation-status/operation-status.service';
import { CacheResolver } from './dashboard/cacheResolver';
import { LocalEventEmitterService } from './common/local-event-emitter.service';
import { RolesResolverService } from './common/roles-resolver.service';
import { AuthorizationService } from './common/authorization.service';
import { AuthoringCacheService } from './common/authoring-cache.service';
import { ProjectService } from './project/project.service';
import { ImportDistributionService } from './import-distribution/import-distribution.service';
import { AuthoringTabbedViewService } from './authoring-tabbed-view/authoring-tabbed-view.service';
import { DraftService } from './new-draft/draft.service';
import { DistributionService } from './distribution/distribution.service';
import { TreeViewService } from './treeview/treeview.service';
import { SignalrService } from './common/signalr.service'

export const customProviders = [
    AuthorizationService,
    HttpService,
    SignalrService,
    UserService,
    NotificationService,
    AuthoringCacheService,
    StorageService,
    LocalEventEmitterService,
    TagCacheService,
    OperationStatusService,
    CacheResolver,
    RolesResolverService,
    ProjectService,
    ImportDistributionService,
    AuthoringTabbedViewService,
    DraftService,
    DistributionService,
    TreeViewService
];

import { ArrayFilterPipe, FilterPropertiesPipe } from './common/array-filter.pipe';
import { ArraySortPipe } from './common/array-sort.pipe';
import { SanitizeHtmlPipe } from './common/sanitize-html';
import { FilterTagsPipe } from './manage-project-tag-group/filter-tags.pipe';
import { EpocToDatetimePipe } from './common/epoc-to-datetime.pipe';
import { FormatDatePipe } from './common/format-date.pipe';
import { RepoNamePipe } from './common/repo-name.pipe';
import { FileSizePipe } from './common/filesize.pipe';
import { RelativeDatePipe } from './common/realted-date.pipe';

export const customPipes = [
    ArrayFilterPipe,
    ArraySortPipe,
    EpocToDatetimePipe,
    SanitizeHtmlPipe,
    FilterTagsPipe,
    FormatDatePipe,
    FilterPropertiesPipe,
    RepoNamePipe,
    FileSizePipe,
    RelativeDatePipe
];
