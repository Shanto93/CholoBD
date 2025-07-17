export interface IErrorSources {
  path: string;
  message: string;
}

export interface IGenericErrorResponse {
  statuscode: number;
  message: string;
  errorSources?: IErrorSources[];
}
