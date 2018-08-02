import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { TagCacheService } from '../tags/tag-cache.service';

@Injectable()
export class CacheResolver implements Resolve<string> {
    constructor(private tagCacheService: TagCacheService, private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
        if (!this.tagCacheService.pendingResponseId) {
            this.tagCacheService.requestTagGroups().then(responseId => {
                return responseId;
            });
        } else {
            return null;
        }
    }
}
