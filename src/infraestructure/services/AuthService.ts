import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Config } from "@config/config";
import { JwtPayload } from "@domain/interfaces/JwtPayload";
import { IAuthService } from "@domain/services/IAuthService";
import {
    InvalidTokenException,
    JwtVerificationException,
    TokenExpiredException,
} from "@config/exceptions/exceptions";

export class AuthService implements IAuthService {
    private readonly jwtSecret: string;
    private readonly jwtExpiresIn: string;

    constructor() {
        this.jwtSecret = Config.jwtSecret;
        this.jwtExpiresIn = Config.jwtExpiresIn;
    }

    public generateToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn as any });
    }

    public verifyToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, this.jwtSecret) as JwtPayload;
        } catch (error) {
            if (error instanceof TokenExpiredError) throw new TokenExpiredException();
            if (error instanceof JsonWebTokenError) throw new InvalidTokenException();
            throw new JwtVerificationException();
        }
    }
}
