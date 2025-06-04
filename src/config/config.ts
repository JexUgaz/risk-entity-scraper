import dotenv from "dotenv";
dotenv.config();

const {
    PORT: port = "3000",
    JWT_SECRET: jwtSecret = "no-secret",
    JWT_EXPIRES_IN: jwtExpiresIn = "1min",
    CHROME_EXECUTABLE_PATH: chromeExecutablePath = "no-path",
} = process.env;

export class Config {
    static readonly port: number = parseInt(port, 10);
    static readonly jwtSecret: string = jwtSecret;
    static readonly jwtExpiresIn: string = jwtExpiresIn;
    static readonly chromeExecutablePath: string = chromeExecutablePath;
}
