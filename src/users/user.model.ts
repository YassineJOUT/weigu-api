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
    cconfirmationCode: number;
}

export class UserDTO{
    constructor(
    public email: string,
    public username?: string, 
    public password?: string,
    public id?: string,
    public confirmationCode?: number)
    {}
}