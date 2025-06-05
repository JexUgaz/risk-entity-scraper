import { AppException, InternalServerError } from "@config/exceptions/exceptions";
import { ApiResponseStatus } from "@domain/enums/ApiResponseStatus";
import { ErrorType } from "@domain/enums/ErrorType";
import { match } from "ts-pattern";

export interface IApiResponse<T = unknown> {
    message: string;
    status: ApiResponseStatus;
    data?: T;
    error?: { type: ErrorType; details: string; code: number };
}

export class ApiResponse<T = unknown> implements IApiResponse<T> {
    public constructor(
        public readonly message: string,
        public readonly status: ApiResponseStatus,
        public readonly data?: T,
        public readonly error?: { type: ErrorType; details: string; code: number },
    ) {}

    static success<T>(message: string, data: T): IApiResponse<T> {
        return {
            message,
            status: ApiResponseStatus.SUCCESS,
            data,
        };
    }

    static exception(e: unknown): IApiResponse<null> {
        const error = match(e)
            .when(
                (e): e is AppException => e instanceof AppException,
                (e) => e,
            )
            .when(
                (e): e is Error => e instanceof Error,
                (e) => new InternalServerError(e.message),
            )
            .otherwise((e) => new InternalServerError("Unknown error: " + JSON.stringify(e)));

        return {
            message: error.message,
            status: ApiResponseStatus.ERROR,
            error: {
                type: error.errorType,
                details: error.details,
                code: error.errorCode,
            },
        };
    }
}
