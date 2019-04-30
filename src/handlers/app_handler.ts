export interface Error {
    isError: boolean;
    messages: [];
}
export interface ResponseData {
  payload: Object;
  error: Error;
}
