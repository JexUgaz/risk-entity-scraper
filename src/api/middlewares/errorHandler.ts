import { ApiResponse } from "@config/helpers/ApiResponse";
import { Request, Response, ErrorRequestHandler, NextFunction } from "express";

export const errorHandler: ErrorRequestHandler = (
    err: unknown,
    _: Request,
    res: Response,
    __: NextFunction,
) => {
    const data = ApiResponse.exception(err);
    res.status(data.error!.code).json(data);
};
