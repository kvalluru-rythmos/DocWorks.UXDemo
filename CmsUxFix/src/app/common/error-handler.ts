import { ErrorHandler } from '@angular/core';
import { ErrorResponse } from './error-response';

export function commonResponseErrorHandler(error: ErrorResponse) {
    return 'error'; // ToDO according to status
}

export class UIErrorHandler implements ErrorHandler {
    handleError(error) {
        // do something with the exception
    }
}
