export interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    bio: string;
    address: string;
    nameHolder: string;
    coverImage: string;
    profileImage: string;
    cconfirmationCode: number;
}
export declare class UserDTO {
    email?: string;
    username?: string;
    password?: string;
    bio?: string;
    address?: string;
    nameHolder?: string;
    coverImage?: string;
    profileImage?: string;
    id?: string;
    confirmationCode?: number;
    constructor(email?: string, username?: string, password?: string, bio?: string, address?: string, nameHolder?: string, coverImage?: string, profileImage?: string, id?: string, confirmationCode?: number);
}
