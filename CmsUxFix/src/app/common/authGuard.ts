import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {UserService} from './user.service';
import {Observable} from 'rxjs/Observable';
import {SignalrService} from './signalr.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService, private signalr: SignalrService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    this.userService.loadProfileIfExists();

    return this.userService.validateJWT().switchMap(value => {
      if (value) {
        return this.signalr.initHubConnection().map((signalrId) => {
          return true;
        });
      }
    }).catch(() => {
      this.router.navigate(['/login'], {queryParams: {postLoginUrl: state.url}});
      return Observable.of(false);
    });

    /*
    if (this.userService.loadProfileIfExists()) {
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { postLoginUrl: state.url }});
    return false;
    */
  }
}
