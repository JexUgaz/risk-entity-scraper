import { Config } from "@config/config";
import { UnauthorizedException } from "@config/exceptions/exceptions";
import { Request, Response, NextFunction } from "express";

export function authenticateInternalKey(req: Request, _: Response, next: NextFunction) {
    const key = req.headers["x-internal-key"];
    if (key !== Config.internalSecretKey) throw new UnauthorizedException();
    next();
}
