import { User, UserDTO } from './user.model';
import { Model } from 'mongoose';
export declare class UsersService {
    private readonly userModel;
    private readonly users;
    constructor(userModel: Model<User>);
    findUser(email: string): Model<User>;
    insertUser(userDto: UserDTO): Promise<any>;
    changePassword(email: string, confirmationCode: string, new_password: string): Promise<boolean>;
    passwordForgotten(email: string, confirmCode: string): Promise<{}>;
    profile(id: string): Model<User>;
}
