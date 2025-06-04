import { ErrorType } from "@domain/enums/ErrorType";

export abstract class AppException extends Error {
    constructor(
        public errorType: ErrorType,
        public details: string,
        public errorCode: number = 500,
        public message: string = "An error occurred while processing your request. Please try again or contact support.",
    ) {
        super(message);
        this.name = "AppException";
    }
}

export class InternalServerError extends AppException {
    constructor(details: string) {
        super(ErrorType.INTERNAL_SERVER, details);
        this.name = "InternalServerError";
    }
}

export class NotFoundException extends AppException {
    constructor(details: string = "Resource not found") {
        super(ErrorType.NOT_FOUND, details, 404, "The requested resource was not found.");
    }
}

export class BadRequestException extends AppException {
    constructor(details: string = "Invalid request parameter") {
        super(ErrorType.BAD_REQUEST, details, 400);
        this.name = "BadRequestException";
    }
}

export class TooManyRequestsException extends AppException {
    constructor(details = "The limit of requests allowed has been exceeded.") {
        super(
            ErrorType.RATE_LIMIT,
            details,
            429,
            "Too many requests. Please try again in a minute.",
        );
        this.name = "TooManyRequestsException";
    }
}

export class UnauthorizedException extends AppException {
    constructor(details: string = "Unauthorized access") {
        super(
            ErrorType.UNAUTHORIZED,
            details,
            401,
            "You are not authorized to access this resource.",
        );
        this.name = "UnauthorizedException";
    }
}

export class TokenExpiredException extends UnauthorizedException {
    constructor(details: string = "The token has expired.") {
        super(details);
        this.name = "TokenExpiredException";
    }
}

export class InvalidTokenException extends UnauthorizedException {
    constructor(details: string = "Invalid JWT token.") {
        super(details);
        this.name = "InvalidTokenException";
    }
}

export class JwtVerificationException extends UnauthorizedException {
    constructor(details: string = "Error verifying the token.") {
        super(details);
        this.name = "JwtVerificationException";
    }
}
