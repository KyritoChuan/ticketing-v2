export interface ResponseDTO<T> {
    statusCode?: number,
    message: string,
    payload: T | null,
}