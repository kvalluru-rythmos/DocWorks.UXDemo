import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthorizationService } from '../common/authorization.service';

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(private authorizationService: AuthorizationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const allowedRoles = route.data['allowedRoles'];
        return this.authorizationService.hasAccess(allowedRoles);
    }
}
