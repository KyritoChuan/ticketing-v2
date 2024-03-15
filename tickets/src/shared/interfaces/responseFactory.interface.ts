import { ResponseDTO } from "../dto/response.dto";

export const RESPONSE_FACTORY_SERVICE = 'RESPONSE_FACTORY_SERVICE';


export interface IResponseFactory {
    ToResponseDTO<T>(statusCode: number, message: string, payload: T): ResponseDTO<T>;
}