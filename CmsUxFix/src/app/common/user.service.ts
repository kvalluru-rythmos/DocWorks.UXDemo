import {Injectable} from '@angular/core';
import {User} from './user';
import {Profile, LoginResponse} from '../login/loginResponse';
import * as _ from 'underscore';
import {Headers, Http, Response} from '@angular/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserService {

  user: User;
  roles: any;

  constructor(private http: Http) {
    this.user = new User();
  }

  setProfile(loginResponse: LoginResponse): void {
    this.user.token = loginResponse.access_token;
    this.user.profile = loginResponse as Profile;

    localStorage.setItem('token', loginResponse.access_token);
    localStorage.setItem('profile', JSON.stringify(this.user.profile));
  }

  loadProfileIfExists(): boolean {
    this.user.token = localStorage.getItem('token');
    const profile = localStorage.getItem('profile');
    if (profile) {
      this.user.profile = JSON.parse(profile);
    }

    if (!this.user.token || !this.user.profile) {
      return false;
    }
    return true;
  }

  getToken(): string {
    return this.user.token ? this.user.token : '';
  }

  getProfile() {
    if (this.user && this.user.profile) {
      this.user.profile.profileShortName = (this.user.profile.firstName ? this.user.profile.firstName.charAt(0).toString().toUpperCase() : '') + (this.user.profile.lastName ? this.user.profile.lastName.charAt(0).toString().toUpperCase() : '');
    }
    return this.user.profile;
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    this.roles = undefined;
    this.user.token = undefined;
    this.user.profile = undefined;
  }

  removeRole(role: string) {
    this.roles = _.without(this.roles, role);
  }

  assignRole(role: string) {
    this.roles.push(role);
  }

  setUserProfilePic(userProfilePic) {
    this.user.profile.profilePicUrl = userProfilePic;
    localStorage.setItem('profile', JSON.stringify(this.user.profile));
  }

  validateJWT() {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken(),
      'SignalrId': "0000000tokenvalidation0000000",
      'ResponseType': "Signalr"
    });

    return this.http.get(environment.API_BASE_URL + '/api/Projects', {headers: headers}).map((response: Response) => {
      return response;
    }).catch((error: any) => {
      return Observable.throw(new Error(error));
    });
  }
}
