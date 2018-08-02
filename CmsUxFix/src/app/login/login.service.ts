import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { urlEncode } from '../common/utils';
import { Observable } from 'rxjs/Rx';
import { Headers, Http } from '@angular/http';

@Injectable()
export class LoginService {
    constructor(private http: Http) {
    }

    doLogin(userName: string, password: string, captchaResponseToken: string): Observable<any> {
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        const body = urlEncode({
            'grant_type': 'password',
            'username': userName,
            'password': password,
            'client_id': 'CMSApiClient',
            'captchaResponseToken': captchaResponseToken
        });

        return this.http.post(environment.API_BASE_URL + '/connect/token', body, { headers: headers }).map((response) => {
            return response;
        });
    }
}
