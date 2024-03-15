import { Injectable } from "@nestjs/common";
import { IResponseFactory } from "../interfaces/responseFactory.interface";
import { ResponseDTO } from "../dto/response.dto";


@Injectable()
export class ResponseFactoryService implements IResponseFactory {
    ToResponseDTO<T>(statusCode: number, message: string, payload: T): ResponseDTO<T> {
        const response: ResponseDTO<T> = {
            statusCode,
            message: message,
            payload: payload,
        }
        return response;
    }

}