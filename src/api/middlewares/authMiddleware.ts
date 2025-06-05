import { UnauthorizedException } from "@config/exceptions/exceptions";
import { AuthService } from "@infraestructure/services/AuthService";
import { Request, Response, NextFunction } from "express";

export function authenticateJWT(req: Request, _: Response, next: NextFunction) {
    const path = req.path;

    if (path === "/login") return next();
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) throw new UnauthorizedException();

    const token = authHeader.split(" ")[1];
    const authService = new AuthService();
    authService.verifyToken(token);
    next();
}
