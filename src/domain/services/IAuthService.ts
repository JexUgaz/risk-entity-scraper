import { JwtPayload } from "@domain/interfaces/JwtPayload";

export abstract class IAuthService {
    abstract generateToken(payload: JwtPayload): string;
    abstract verifyToken(token: string): JwtPayload;
}
