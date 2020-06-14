import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
import { UserDTO } from './user.model';
export declare class UsersController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UsersService, authService: AuthService);
    login(req: any): Promise<any>;
    verifyLink(req: any): {
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: undefined;
    };
    loginMagicLink(req: any): Promise<{
        success: boolean;
        error: string;
        payload?: undefined;
    } | {
        success: boolean;
        payload: any;
        error?: undefined;
    }>;
    getProfile(body: any): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        error?: undefined;
    }>;
    uploadedFile(file: any, body: any): Promise<{
        success: boolean;
        data: {
            originalname: any;
            filename: any;
        };
    } | {
        success: boolean;
        error: string;
    }>;
    seeUploadedFile(image: any, res: any): any;
    updateProfile(userDto: UserDTO): Promise<{
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    changePwd(req: any): {
        status: string;
        message: string;
    };
    passwordForgotten(req: any): Promise<{}>;
    signUp(req: any): Promise<{
        success: boolean;
        error: {
            message: string;
        };
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        message?: undefined;
    }>;
}
