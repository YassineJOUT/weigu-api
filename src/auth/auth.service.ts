/*
  * @file-description : Authentication service provide user validation and JWT token generation
  * @author{Yassine JOUT} yassinejout@gmail.com
*/

// Import the required modules
import * as bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
    ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUser(email);
   
    if (!user) {
      return {
        success: false,
        error: {
          code: 1,
          message: "Username or password incorrect"
        }
      }
    }

    
    const valid = await bcryptjs.compare(pass, user.password);
  
    if (!valid) {
      return {
        success: false,
        error: {
          code: 1,
          message: "Username or password incorrect"
        }
      }
    }
  
    
    return {
      data: user,
      success: true,
    };
    
  }

  async login(user) {
    if(user.success){
      const playload = { email: user.data.email, sub: user.data._id };
      const userD = user.data;
      return {
        success: true,
        data:{
        access_token: this.jwtService.sign(playload),
        user: userD
      }
      };
    }
    return user;
    
  }
}