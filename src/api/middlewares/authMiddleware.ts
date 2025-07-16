import { UnauthorizedException, UserNotFoundException } from "@config/exceptions/exceptions";
import { getUsers } from "@data/users";
import { AuthService } from "@infraestructure/services/AuthService";
import { Request, Response, NextFunction } from "express";

export async function authenticateJWT(req: Request, _: Response, next: NextFunction) {
    const path = req.path;

    if (path === "/login") return next();
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) throw new UnauthorizedException();

    const token = authHeader.split(" ")[1];
    const authService = new AuthService();
    const payload = authService.verifyToken(token);
    const users = getUsers();
    const exists = users.some((u) => u.id === payload.userId);
    if (!exists) throw new UserNotFoundException();
    next();
}
