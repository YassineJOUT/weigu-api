/*
  * @file-description : User model, provides the user schema and the interface that defines the user properties
  * @author{Yassine JOUT} yassinejout@gmail.com
*/

// Import the required modules
export interface User{
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

export class UserDTO{
    constructor(
    public email?: string,
    public username?: string, 
    public password?: string,
    public bio?: string,
    public address?: string,
    public nameHolder?: string,
    public coverImage?: string,
    public profileImage?: string,
    public id?: string,
    public confirmationCode?: number)
    {}
}