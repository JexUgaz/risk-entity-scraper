import { NotFoundException } from "@config/exceptions/exceptions";
import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundException(`The path ${req.originalUrl} was not found.`));
};
