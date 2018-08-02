import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class LocalEventEmitterService {
    data: any;
    constructor() { }
    localEvent = new EventEmitter();
    operationEvent = new EventEmitter();
}
