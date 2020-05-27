export interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    cconfirmationCode: number;
}
export declare class UserDTO {
    username: string;
    email: string;
    password: string;
    id?: string;
    confirmationCode?: number;
    constructor(username: string, email: string, password: string, id?: string, confirmationCode?: number);
}
