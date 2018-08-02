import { Optional } from '@angular/core';

export class Operation {
    responseId: string;
    cmsOperation: string;
    status: string;
    data: any;
    operationDate: any;
    url: string;

    constructor(responseId, cmsOperation, status, data, @Optional() url = '') {
        this.responseId = responseId;
        this.cmsOperation = cmsOperation;
        this.status = status;
        this.data = data;
        this.operationDate = new Date().getTime() / 1000;
        this.url = url;
    }
}
