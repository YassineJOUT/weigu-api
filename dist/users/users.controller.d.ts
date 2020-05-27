import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UsersService, authService: AuthService);
    login(req: any): Promise<{
        status: string;
        token: string;
        user: any;
    }>;
    getProfile(req: any): any;
    changePwd(req: any): {
        status: string;
        message: string;
    };
    passwordForgotten(req: any): Promise<{}>;
    addUser(req: any): Promise<any>;
}
