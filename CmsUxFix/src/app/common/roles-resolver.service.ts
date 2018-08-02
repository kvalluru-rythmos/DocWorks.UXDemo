import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class RolesResolverService implements Resolve<boolean> {
    constructor(private httpService: HttpService, private userService: UserService, private authorizationService: AuthorizationService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.authorizationService.cmsOperationRolesMapping) {
            this.getUserRoles().then(response => {
                this.authorizationService.setCmsOperationRolesMapping(response.rolesAndPermissions);
                this.userService.roles = response.roles;
                return true;
            });
        } else {
            return true;
        }
    }

    getUserRoles() {
        return this.httpService.get(environment.API_BASE_URL + '/api/RolesAndPermissions')
            .toPromise().then(response => {
                return response.json();
            });
    }

}
