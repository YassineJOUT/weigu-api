import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    makeJwtLink(payload: any): Promise<string>;
    decodeJwt(token: any): Promise<any>;
    login(user: any): Promise<any>;
}
