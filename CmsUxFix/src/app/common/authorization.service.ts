import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { applicationConstants, cmsOperation } from '../constants';
import { UserService } from './user.service';

@Injectable()
export class AuthorizationService {
    cmsOperationRolesMapping: any;

    constructor(private userService: UserService) { }

    setCmsOperationRolesMapping(rolesAndPermissions: any[]) {
        this.cmsOperationRolesMapping = {};
        _.each(rolesAndPermissions, function (aRoleAndPermissions) {
            _.each(aRoleAndPermissions.permissions, function (permission) {
                this.insertData(cmsOperation[permission], applicationConstants.roles[aRoleAndPermissions.name]);
            }.bind(this));
        }.bind(this));
    }

    insertData(operation: cmsOperation, role: string) {
        if (!(operation in this.cmsOperationRolesMapping)) {
            this.cmsOperationRolesMapping[operation] = [role];
        } else {
            this.cmsOperationRolesMapping[operation].push(role);
        }
    }

    isOperationAllowed(cmsOperations: any[]) {
        const isOperationAllowed = _.find(cmsOperations, function (operation) {
            return this.checkHasRole(operation);
        }.bind(this));
        return isOperationAllowed ? true : false;
    }

    checkHasRole(operation) {
        const matchingRoles = _.intersection(this.cmsOperationRolesMapping ? this.cmsOperationRolesMapping[operation] : [], this.userService.roles);
        return matchingRoles.length > 0 ? true : false;
    }

    hasAccess(allowedRoles: string[]) {
        return _.intersection(this.userService.roles, allowedRoles).length > 0 ? true : false;
    }

    isProjectAdmin(projectAdmins: string[]) {
        if (!this.userService.user || !projectAdmins) {
            return false;
        }
        const loggedInUserId = this.userService.user.profile.userId;
        const user = _.find((projectAdmins), function (value) {
            return value.userId === loggedInUserId;
        }.bind(this));
        return user ? true : false;
    }
}
