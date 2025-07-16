import { Request, Response } from "express";
import { ApiResponse } from "@config/helpers";
import { getUsers } from "@data/users";
import { BadRequestException, UnauthorizedException } from "@config/exceptions/exceptions";
import bcrypt from "bcryptjs";
import { AuthService } from "@infraestructure/services/AuthService";
import { IAuthService } from "@domain/services/IAuthService";

class AuthController {
    public static async login(req: Request, res: Response) {
        const authService: IAuthService = new AuthService();
        const { username, password } = req.body;

        if (!username || !password) {
            throw new BadRequestException("Username and password are required.");
        }

        const users = getUsers();
        const user = users.find((u) => u.username === username);
        if (!user) throw new UnauthorizedException("Invalid credentials");

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new UnauthorizedException("Invalid credentials");

        const token = authService.generateToken({ userId: user.id, username: user.username });

        res.json(ApiResponse.success("Login successful", { token }));
    }
}

export default AuthController;
