import { Component, OnInit, Injector } from '@angular/core';
import { UserService } from '../common/user.service';
import { Router } from '@angular/router';
import { OperationStatusService } from '../operation-status/operation-status.service';
import { AuthorizationService } from '../common/authorization.service';
import { UpdateProfilePictureComponent } from '../update-profile-picture/update-profile-picture.component';
import { MatDialog } from '@angular/material';
import { BaseComponent } from '../base.component';
import { ProfileService } from '../update-profile-picture/profile.service';
import { Operation } from '../operation-status/operation';
import { cmsOperation, eventStatus, applicationConstants } from '../constants';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    providers: [ProfileService]
})
export class HeaderComponent extends BaseComponent implements OnInit {
    unReadOperationCount;
    userProfile: any;
    isUpdateInProgress: boolean;
    constructor(public injector: Injector, public userService: UserService, private router: Router, public authorizationService: AuthorizationService,
        private operationStatusService: OperationStatusService, public dialog: MatDialog, public profileService: ProfileService) {
        super(injector, { title: undefined } as any);
        this.subscribeToOperationEvent();
    }

    ngOnInit() {
        this.userProfile = this.userService.getProfile();
    }

    subscribeToOperationEvent() {
        this.localEventEmitterService.operationEvent.subscribe((data: any) => {
            const eventName = data.eventName;
            if (eventName && this[eventName]) {
                this[eventName](data.value);
            }
        });
    }

    operationStatusUpdateEvent(operations: any) {
        this.unReadOperationCount = this.operationStatusService.getUnreadOperationCount();
    }

    getFirstName(): string {
        return this.userService.user.profile.firstName;
    }

    openSideNav() {
        this.operationStatusService.markOperationAsRead();
        this.emitLocalEvent({ eventName: 'openNotificationSideNav', value: true });
    }

    logout() {
        this.userService.logOut();
        this.router.navigate(['/login']);
        this.authorizationService.cmsOperationRolesMapping = undefined;
    }

    navLinks = [
        { label: 'Authoring', path: '/dashboard' },
        { label: 'Publishing', path: '/publish-home' },
        { label: 'Media', path: '/media' },
        { label: 'System', path: '/system' },
        { label: 'Analytics', path: '/analytics' },
        { label: 'Glossary', path: '/glossary-home' },
        { label: 'Developer-Dashboard', path: '/developer-dashboard' }
    ];

    updateProfilePic() {
        let dialogRef = this.dialog.open(UpdateProfilePictureComponent, { width: '530px' });
        dialogRef.afterClosed().subscribe(responseId => {
            if (responseId) {
                this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.uploadUserProfilePic });
                const operation = new Operation(responseId, cmsOperation.UploadUserProfilePic, eventStatus.Wait, {});
                this.addOperationEvent(operation);
            }
        });
    }

    removeUserProfilePic() {
        this.isUpdateInProgress = true;
        this.profileService.removeUserProfilePic().then(responseId => {
            this.isUpdateInProgress = false;
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.deleteUserProfilePic });
            const operation = new Operation(responseId, cmsOperation.UploadUserProfilePic, eventStatus.Wait, {});
            this.addOperationEvent(operation);
        }, error => {
            this.isUpdateInProgress = false;
            console.log(error);
        });
    }

    deleteUserProfilePicEvent(notification) {
        this.userService.setUserProfilePic(undefined);
    }

    uploadUserProfilePicEvent(notification) {
        const userProfilePic = notification.data.content.profilePicUrl;
        this.userService.setUserProfilePic(userProfilePic);
    }
}
