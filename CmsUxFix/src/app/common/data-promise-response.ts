import { Observable } from 'rxjs/Observable';

export class ServiceResponse {
    data: any;
    responseObservable: Observable<any>;

    constructor() {
    }
}
