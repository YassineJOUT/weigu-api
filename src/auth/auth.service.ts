/*
 * @file-description : Authentication service provide user validation and JWT token generation
 * @author{Yassine JOUT} yassinejout@gmail.com
 */

// Import the required modules
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUser(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return {
        data: result,
        success: true,
      };
    }
    return {
      success: false,
      error: {
        code: 1,
        message: 'Username or password incorrect',
      },
    };
  }

  async login(user) {
    const playload = { email: user.email, sub: user._id };
    const userD = user;
    return {
      success: true,
      data: {
        access_token: this.jwtService.sign(playload),
        user: userD,
      },
    };
  }
}
