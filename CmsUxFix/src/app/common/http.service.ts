import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SignalrService } from './signalr.service';

@Injectable()
export class HttpService {

    constructor(private http: Http, private userService: UserService, private router: Router, private Signalr : SignalrService) { }

    post(url: string, body: Object): Observable<Response> {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.userService.getToken(),
            'SignalrId': this.Signalr.signalrId,
            'ResponseType': "Signalr"
        });

        return this.http.post(url, JSON.stringify(body), { headers: headers }).map((response: Response) => {
            return response;
        }).catch((error: any) => {
            if (error.status === 401 || error.status === 403) {
                this.userService.logOut();
                this.router.navigate(['/login']);
                return Observable.never();
            } else {
                return Observable.throw(new Error(error));
            }
        });
    }
    put(url: string, body: Object): Observable<Response> {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.userService.getToken(),
            'SignalrId': this.Signalr.signalrId,
            'ResponseType': "Signalr"
        });

        return this.http.put(url, JSON.stringify(body), { headers: headers }).map((response: Response) => {
            return response;
        }).catch((error: any) => {
            if (error.status === 401 || error.status === 403) {
                this.userService.logOut();
                this.router.navigate(['/login']);
                return Observable.never();
            } else {
                return Observable.throw(new Error(error));
            }
        });
    }
    get(url: string): Observable<Response> {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.userService.getToken(),
            'SignalrId': this.Signalr.signalrId,
            'ResponseType': "Signalr"
        });

        return this.http.get(url, { headers: headers }).map((response: Response) => {
            return response;
        }).catch((error: any) => {
            if (error.status === 401 || error.status === 403) {
                this.userService.logOut();
                this.router.navigate(['/login']);
                return Observable.never();
            } else {
                return Observable.throw(new Error(error));
            }
        });
    }

    delete(url: string): Observable<Response> {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.userService.getToken(),
            'SignalrId': this.Signalr.signalrId,
            'ResponseType': "Signalr"
        });
        return this.http.delete(url, { headers: headers }).map((response: Response) => {
            return response;
        }).catch((error: any) => {
            if (error.status === 401 || error.status === 403) {
                this.userService.logOut();
                this.router.navigate(['/login']);
                return Observable.never();
            } else {
                return Observable.throw(new Error(error));
            }
        });
    }
    getResponse(responseId: string) {
        return this.get(environment.API_BASE_URL + '/api/Responses/' + responseId).toPromise().then(response => {
            return response;
        }).catch((error: any) => {
            if (error.status === 401 || error.status === 403) {
                this.userService.logOut();
                this.router.navigate(['/login']);
                return {} as Response;
            } else {
                throw Error(error);
            }
        });
    }
}
