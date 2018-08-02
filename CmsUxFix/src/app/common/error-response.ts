export class ErrorResponse {
    ModelValidationErrors: any;
    Message: string;
    ExceptionDetail: ExceptionDetail;
    HttpStatusCode: any;
}

export class ExceptionDetail {
    ExceptionMessage: string;
    StackTrace: string;
    InnerExceptionMessage: string;
    InnerExceptionStackTrace: string;
}
